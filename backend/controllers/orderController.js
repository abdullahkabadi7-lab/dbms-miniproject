const db = require('../db');

// POST /api/orders
// Full ACID Transaction implementation
exports.createOrder = async (req, res) => {
  const client = await db.pool.connect();
  try {
    const {
      userId,
      user_id,
      email,
      fullName,
      full_name,
      phone,
      shippingAddress,
      shipping_address,
      items = [],
      cart = []
    } = req.body;

    const orderItems = items.length > 0 ? items : cart;
    const finalAddress = shipping_address || shippingAddress;
    const finalEmail = email || '';

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ success: false, error: 'Cannot checkout with an empty cart.' });
    }

    if (!finalAddress) {
      return res.status(400).json({ success: false, error: 'Shipping address is required.' });
    }

    // 1. Resolve or verify user in PostgreSQL
    let customerUserId = user_id || userId;
    if (!customerUserId) {
      // Find by email or fallback to demo customer
      if (finalEmail) {
        const uRes = await client.query('SELECT user_id FROM users WHERE email = $1', [finalEmail]);
        if (uRes.rows.length > 0) {
          customerUserId = uRes.rows[0].user_id;
        } else {
          // Create customer account for new checkout
          const newU = await client.query(`
            INSERT INTO users (full_name, email, password, role, phone, address)
            VALUES ($1, $2, 'custPass123', 'customer', $3, $4)
            RETURNING user_id
          `, [full_name || fullName || 'Valued Customer', finalEmail, phone || '', finalAddress]);
          customerUserId = newU.rows[0].user_id;
        }
      } else {
        const defaultU = await client.query("SELECT user_id FROM users WHERE role = 'customer' LIMIT 1");
        customerUserId = defaultU.rows[0] ? defaultU.rows[0].user_id : 1;
      }
    }

    // =========================================================================
    // START POSTGRESQL TRANSACTION (BEGIN)
    // =========================================================================
    await client.query('BEGIN');

    // Step 1 & 2: Lock and verify inventory rows FOR UPDATE
    const validatedItems = [];
    let calculatedTotal = 0;

    for (const item of orderItems) {
      const prodId = item.product_id || (item.product && item.product.product_id);
      const requestedQty = parseInt(item.quantity, 10);

      if (!prodId || isNaN(requestedQty) || requestedQty <= 0) {
        await client.query('ROLLBACK');
        return res.status(400).json({
          success: false,
          error: 'Invalid product or quantity specified in order payload.'
        });
      }

      // SELECT FOR UPDATE locks the specific inventory row
      const invRes = await client.query(`
        SELECT i.inventory_id, i.product_id, i.quantity_in_stock, p.product_name, p.selling_price, p.supplier_id
        FROM inventory i
        JOIN products p ON i.product_id = p.product_id
        WHERE i.product_id::text = $1
        FOR UPDATE
      `, [prodId]);

      if (invRes.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({
          success: false,
          error: `Product with ID ${prodId} not found in catalog or inventory.`
        });
      }

      const invRow = invRes.rows[0];

      // Step 3: Check stock adequacy
      if (invRow.quantity_in_stock < requestedQty) {
        await client.query('ROLLBACK');
        return res.status(400).json({
          success: false,
          error: `Transaction Rolled Back: Insufficient inventory for "${invRow.product_name}". Available: ${invRow.quantity_in_stock}, Requested: ${requestedQty}.`
        });
      }

      const unitPrice = parseFloat(invRow.selling_price);
      const itemSubtotal = +(unitPrice * requestedQty).toFixed(2);
      calculatedTotal += itemSubtotal;

      validatedItems.push({
        productId: invRow.product_id,
        productName: invRow.product_name,
        supplierId: invRow.supplier_id,
        quantity: requestedQty,
        unitPrice,
        subtotal: itemSubtotal
      });
    }

    // Step 4a: Insert into orders table
    const orderInsertQuery = `
      INSERT INTO orders (user_id, total_amount, status, shipping_address)
      VALUES ($1, $2, 'CONFIRMED', $3)
      RETURNING order_id, user_id, order_date, total_amount, status, shipping_address
    `;
    const orderRes = await client.query(orderInsertQuery, [
      customerUserId,
      calculatedTotal,
      finalAddress
    ]);
    const createdOrder = orderRes.rows[0];
    const newOrderId = createdOrder.order_id;

    // Step 4b: Insert order_items, reduce inventory, and record stock_transactions
    const createdItems = [];

    for (const vItem of validatedItems) {
      // Insert line item
      const itemInsertQuery = `
        INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `;
      const itemRes = await client.query(itemInsertQuery, [
        newOrderId,
        vItem.productId,
        vItem.quantity,
        vItem.unitPrice,
        vItem.subtotal
      ]);
      createdItems.push({
        ...itemRes.rows[0],
        product_name: vItem.productName,
        name: vItem.productName
      });

      // Reduce inventory
      const reduceInvQuery = `
        UPDATE inventory
        SET quantity_in_stock = quantity_in_stock - $1,
            last_updated = CURRENT_TIMESTAMP
        WHERE product_id = $2
      `;
      await client.query(reduceInvQuery, [vItem.quantity, vItem.productId]);

      // Insert STOCK_OUT record into stock_transactions
      const txInsertQuery = `
        INSERT INTO stock_transactions (
          product_id,
          supplier_id,
          transaction_type,
          quantity,
          unit_price,
          total_amount,
          reference_id,
          reference_type
        ) VALUES ($1, $2, 'STOCK_OUT', $3, $4, $5, $6, 'ORDER')
      `;
      await client.query(txInsertQuery, [
        vItem.productId,
        vItem.supplierId || null,
        -vItem.quantity, // Negative indicating outward deduction
        vItem.unitPrice,
        vItem.subtotal,
        String(newOrderId)
      ]);
    }

    // =========================================================================
    // COMMIT TRANSACTION
    // =========================================================================
    await client.query('COMMIT');

    // Fetch user details for frontend compatibility
    const userRowRes = await db.query('SELECT full_name, email, phone FROM users WHERE user_id = $1', [customerUserId]);
    const userDetails = userRowRes.rows[0] || {};

    const formattedOrder = {
      order_id: String(createdOrder.order_id),
      user_id: String(createdOrder.user_id),
      customer_id: String(createdOrder.user_id),
      customer_name: userDetails.full_name || 'Customer',
      customer_email: userDetails.email || finalEmail,
      customer_phone: userDetails.phone || phone || '',
      shipping_address: createdOrder.shipping_address,
      subtotal: parseFloat(createdOrder.total_amount),
      tax: +(parseFloat(createdOrder.total_amount) * 0.08).toFixed(2),
      shipping_fee: 0,
      total: parseFloat(createdOrder.total_amount),
      total_amount: parseFloat(createdOrder.total_amount),
      status: createdOrder.status,
      created_at: createdOrder.order_date,
      order_date: createdOrder.order_date,
      items: createdItems
    };

    return res.status(201).json({
      success: true,
      order: formattedOrder
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Order Transaction Rolled Back due to error:', error);
    return res.status(500).json({
      success: false,
      error: `Order processing failed: ${error.message}`
    });
  } finally {
    client.release();
  }
};

// GET /api/orders
exports.getOrders = async (req, res) => {
  try {
    const { userId, user_id, email } = req.query;
    let queryText = `
      SELECT 
        o.order_id,
        o.user_id,
        u.full_name AS customer_name,
        u.email AS customer_email,
        u.phone AS customer_phone,
        o.order_date,
        o.order_date AS created_at,
        CAST(o.total_amount AS FLOAT) AS total_amount,
        CAST(o.total_amount AS FLOAT) AS total,
        CAST(o.total_amount AS FLOAT) AS subtotal,
        o.status,
        o.shipping_address
      FROM orders o
      JOIN users u ON o.user_id = u.user_id
      WHERE 1=1
    `;
    const params = [];

    const targetUser = user_id || userId;
    if (targetUser) {
      params.push(targetUser);
      queryText += ` AND o.user_id::text = $${params.length}`;
    }

    if (email) {
      params.push(email);
      queryText += ` AND u.email = $${params.length}`;
    }

    queryText += ` ORDER BY o.order_date DESC`;

    const ordersRes = await db.query(queryText, params);
    const orders = ordersRes.rows;

    // Fetch items for each order
    if (orders.length > 0) {
      const orderIds = orders.map((o) => o.order_id);
      const itemsRes = await db.query(`
        SELECT 
          oi.order_item_id,
          oi.order_id,
          oi.product_id,
          p.product_name,
          p.product_name AS name,
          p.image_url,
          oi.quantity,
          CAST(oi.unit_price AS FLOAT) AS unit_price,
          CAST(oi.subtotal AS FLOAT) AS subtotal
        FROM order_items oi
        JOIN products p ON oi.product_id = p.product_id
        WHERE oi.order_id = ANY($1)
        ORDER BY oi.order_item_id ASC
      `, [orderIds]);

      const itemsByOrder = {};
      itemsRes.rows.forEach((item) => {
        if (!itemsByOrder[item.order_id]) itemsByOrder[item.order_id] = [];
        itemsByOrder[item.order_id].push(item);
      });

      orders.forEach((o) => {
        o.order_id = String(o.order_id);
        o.customer_id = String(o.user_id);
        o.tax = +(o.total * 0.08).toFixed(2);
        o.shipping_fee = 0;
        o.items = itemsByOrder[o.order_id] || [];
      });
    }

    return res.json({ success: true, orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/orders/:id
exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const orderRes = await db.query(`
      SELECT 
        o.order_id,
        o.user_id,
        u.full_name AS customer_name,
        u.email AS customer_email,
        u.phone AS customer_phone,
        o.order_date,
        o.order_date AS created_at,
        CAST(o.total_amount AS FLOAT) AS total_amount,
        CAST(o.total_amount AS FLOAT) AS total,
        CAST(o.total_amount AS FLOAT) AS subtotal,
        o.status,
        o.shipping_address
      FROM orders o
      JOIN users u ON o.user_id = u.user_id
      WHERE o.order_id::text = $1
    `, [id]);

    if (orderRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const order = orderRes.rows[0];
    order.order_id = String(order.order_id);
    order.customer_id = String(order.user_id);
    order.tax = +(order.total * 0.08).toFixed(2);
    order.shipping_fee = 0;

    const itemsRes = await db.query(`
      SELECT 
        oi.order_item_id,
        oi.order_id,
        oi.product_id,
        p.product_name,
        p.product_name AS name,
        p.image_url,
        oi.quantity,
        CAST(oi.unit_price AS FLOAT) AS unit_price,
        CAST(oi.subtotal AS FLOAT) AS subtotal
      FROM order_items oi
      JOIN products p ON oi.product_id = p.product_id
      WHERE oi.order_id::text = $1
      ORDER BY oi.order_item_id ASC
    `, [id]);

    order.items = itemsRes.rows;

    return res.json({ success: true, order });
  } catch (error) {
    console.error('Error fetching order by ID:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
