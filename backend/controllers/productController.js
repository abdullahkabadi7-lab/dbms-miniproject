const db = require('../db');

// Helper to calculate stock_status
const getStockStatus = (stock, reorder) => {
  if (stock <= 0) return 'OUT_OF_STOCK';
  if (stock <= reorder) return 'LOW_STOCK';
  return 'IN_STOCK';
};

// GET /api/products
exports.getProducts = async (req, res) => {
  try {
    const { category, search } = req.query;
    let queryText = `
      SELECT 
        p.product_id,
        p.product_name,
        p.product_name AS name,
        p.description,
        p.category_id,
        c.category_name,
        p.supplier_id,
        s.supplier_name,
        CAST(p.selling_price AS FLOAT) AS selling_price,
        CAST(p.cost_price AS FLOAT) AS cost_price,
        p.unit,
        p.image_url,
        p.created_at,
        COALESCE(i.quantity_in_stock, 0) AS current_stock,
        COALESCE(i.quantity_in_stock, 0) AS quantity_in_stock,
        COALESCE(i.reorder_level, 5) AS reorder_level,
        i.inventory_id
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.category_id
      LEFT JOIN suppliers s ON p.supplier_id = s.supplier_id
      LEFT JOIN inventory i ON p.product_id = i.product_id
      WHERE 1=1
    `;
    const params = [];

    if (category && category !== 'all') {
      params.push(category);
      queryText += ` AND (p.category_id::text = $${params.length} OR c.category_name = $${params.length})`;
    }

    if (search && search.trim() !== '') {
      params.push(`%${search.trim()}%`);
      queryText += ` AND (p.product_name ILIKE $${params.length} OR p.description ILIKE $${params.length})`;
    }

    queryText += ` ORDER BY p.product_id ASC`;

    const result = await db.query(queryText, params);
    const products = result.rows.map((row) => ({
      ...row,
      stock_status: getStockStatus(row.current_stock, row.reorder_level)
    }));

    return res.json({ success: true, products });
  } catch (error) {
    console.error('Error fetching products:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/products/:id
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const queryText = `
      SELECT 
        p.product_id,
        p.product_name,
        p.product_name AS name,
        p.description,
        p.category_id,
        c.category_name,
        p.supplier_id,
        s.supplier_name,
        CAST(p.selling_price AS FLOAT) AS selling_price,
        CAST(p.cost_price AS FLOAT) AS cost_price,
        p.unit,
        p.image_url,
        p.created_at,
        COALESCE(i.quantity_in_stock, 0) AS current_stock,
        COALESCE(i.quantity_in_stock, 0) AS quantity_in_stock,
        COALESCE(i.reorder_level, 5) AS reorder_level,
        i.inventory_id
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.category_id
      LEFT JOIN suppliers s ON p.supplier_id = s.supplier_id
      LEFT JOIN inventory i ON p.product_id = i.product_id
      WHERE p.product_id::text = $1
    `;
    const result = await db.query(queryText, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const row = result.rows[0];
    const product = {
      ...row,
      stock_status: getStockStatus(row.current_stock, row.reorder_level)
    };

    return res.json({ success: true, product });
  } catch (error) {
    console.error('Error fetching product by id:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/products
// Creates product and corresponding 1:1 inventory in a transaction
exports.createProduct = async (req, res) => {
  const client = await db.pool.connect();
  try {
    const {
      name,
      product_name,
      description = '',
      category_id,
      supplier_id,
      selling_price = 0,
      cost_price = 0,
      unit = 'piece',
      image_url = '',
      initial_stock = 0,
      current_stock = 0,
      reorder_level = 5
    } = req.body;

    const pName = product_name || name;
    const stockQty = initial_stock !== undefined ? initial_stock : current_stock;

    if (!pName || !category_id) {
      return res.status(400).json({ success: false, message: 'Product name and category_id are required' });
    }

    await client.query('BEGIN');

    // 1. Insert product
    const insertProd = `
      INSERT INTO products (category_id, supplier_id, product_name, description, selling_price, cost_price, unit, image_url)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
    const prodRes = await client.query(insertProd, [
      category_id,
      supplier_id || null,
      pName,
      description,
      selling_price,
      cost_price,
      unit,
      image_url
    ]);
    const newProduct = prodRes.rows[0];

    // 2. Insert 1:1 inventory record
    const insertInv = `
      INSERT INTO inventory (product_id, quantity_in_stock, reorder_level)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const invRes = await client.query(insertInv, [
      newProduct.product_id,
      parseInt(stockQty, 10) || 0,
      parseInt(reorder_level, 10) || 5
    ]);
    const newInv = invRes.rows[0];

    // 3. Log initial stock transaction if stock > 0
    if (stockQty > 0) {
      await client.query(`
        INSERT INTO stock_transactions (product_id, supplier_id, transaction_type, quantity, unit_price, total_amount, reference_id, reference_type)
        VALUES ($1, $2, 'STOCK_IN', $3, $4, $5, 'INIT', 'RESTOCK')
      `, [
        newProduct.product_id,
        supplier_id || null,
        stockQty,
        cost_price,
        stockQty * cost_price
      ]);
    }

    await client.query('COMMIT');

    const combined = {
      ...newProduct,
      name: newProduct.product_name,
      current_stock: newInv.quantity_in_stock,
      quantity_in_stock: newInv.quantity_in_stock,
      reorder_level: newInv.reorder_level,
      stock_status: getStockStatus(newInv.quantity_in_stock, newInv.reorder_level)
    };

    return res.status(201).json({ success: true, product: combined });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating product:', error);
    return res.status(500).json({ success: false, message: error.message });
  } finally {
    client.release();
  }
};

// PUT /api/products/:id
exports.updateProduct = async (req, res) => {
  const client = await db.pool.connect();
  try {
    const { id } = req.params;
    const {
      name,
      product_name,
      description,
      category_id,
      supplier_id,
      selling_price,
      cost_price,
      unit,
      image_url,
      current_stock,
      initial_stock,
      reorder_level
    } = req.body;

    const pName = product_name || name;

    await client.query('BEGIN');

    // Update product table
    const updateProd = `
      UPDATE products
      SET product_name = COALESCE($1, product_name),
          description = COALESCE($2, description),
          category_id = COALESCE($3, category_id),
          supplier_id = COALESCE($4, supplier_id),
          selling_price = COALESCE($5, selling_price),
          cost_price = COALESCE($6, cost_price),
          unit = COALESCE($7, unit),
          image_url = COALESCE($8, image_url)
      WHERE product_id::text = $9
      RETURNING *
    `;
    const prodRes = await client.query(updateProd, [
      pName || null,
      description !== undefined ? description : null,
      category_id || null,
      supplier_id !== undefined ? supplier_id : null,
      selling_price !== undefined ? selling_price : null,
      cost_price !== undefined ? cost_price : null,
      unit || null,
      image_url || null,
      id
    ]);

    if (prodRes.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Optional inventory update if supplied
    const targetStock = current_stock !== undefined ? current_stock : initial_stock;
    if (targetStock !== undefined || reorder_level !== undefined) {
      await client.query(`
        UPDATE inventory
        SET quantity_in_stock = COALESCE($1, quantity_in_stock),
            reorder_level = COALESCE($2, reorder_level),
            last_updated = CURRENT_TIMESTAMP
        WHERE product_id::text = $3
      `, [
        targetStock !== undefined ? parseInt(targetStock, 10) : null,
        reorder_level !== undefined ? parseInt(reorder_level, 10) : null,
        id
      ]);
    }

    await client.query('COMMIT');
    return res.json({ success: true, message: 'Product updated successfully' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error updating product:', error);
    return res.status(500).json({ success: false, message: error.message });
  } finally {
    client.release();
  }
};

// DELETE /api/products/:id
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM products WHERE product_id::text = $1 RETURNING product_id', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    return res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
