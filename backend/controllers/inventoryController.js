const db = require('../db');

// Helper to calculate stock_status
const getStockStatus = (stock, reorder) => {
  if (stock <= 0) return 'OUT_OF_STOCK';
  if (stock <= reorder) return 'LOW_STOCK';
  return 'IN_STOCK';
};

// GET /api/inventory
exports.getInventory = async (req, res) => {
  try {
    const query = `
      SELECT 
        i.inventory_id,
        i.product_id,
        p.product_name,
        p.product_name AS name,
        c.category_name,
        s.supplier_name,
        i.quantity_in_stock,
        i.quantity_in_stock AS current_stock,
        i.reorder_level,
        i.last_updated
      FROM inventory i
      JOIN products p ON i.product_id = p.product_id
      LEFT JOIN categories c ON p.category_id = c.category_id
      LEFT JOIN suppliers s ON p.supplier_id = s.supplier_id
      ORDER BY i.inventory_id ASC
    `;
    const result = await db.query(query);
    const inventory = result.rows.map((row) => ({
      ...row,
      status: getStockStatus(row.quantity_in_stock, row.reorder_level),
      stock_status: getStockStatus(row.quantity_in_stock, row.reorder_level)
    }));

    return res.json({ success: true, inventory });
  } catch (error) {
    console.error('Error fetching inventory:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/inventory/:productId
// Handles restocking and updates stock_transactions audit log
exports.updateInventory = async (req, res) => {
  const client = await db.pool.connect();
  try {
    const { productId } = req.params;
    const { quantity, restockAmount, reorder_level, notes = 'Replenished stock via inventory console' } = req.body;

    const amountToAdd = restockAmount !== undefined ? parseInt(restockAmount, 10) : (quantity !== undefined ? parseInt(quantity, 10) : 0);

    await client.query('BEGIN');

    // 1. Fetch current inventory & product details FOR UPDATE
    const currentRes = await client.query(`
      SELECT i.*, p.product_name, p.cost_price, p.supplier_id
      FROM inventory i
      JOIN products p ON i.product_id = p.product_id
      WHERE i.product_id::text = $1
      FOR UPDATE
    `, [productId]);

    if (currentRes.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ success: false, message: 'Inventory record not found for product' });
    }

    const currentInv = currentRes.rows[0];
    const newStock = Math.max(0, currentInv.quantity_in_stock + amountToAdd);
    const newReorder = reorder_level !== undefined ? parseInt(reorder_level, 10) : currentInv.reorder_level;

    // 2. Update inventory table
    await client.query(`
      UPDATE inventory
      SET quantity_in_stock = $1,
          reorder_level = $2,
          last_updated = CURRENT_TIMESTAMP
      WHERE product_id::text = $3
    `, [newStock, newReorder, productId]);

    // 3. Insert stock_transactions record if quantity changed
    if (amountToAdd !== 0) {
      const txType = amountToAdd > 0 ? 'STOCK_IN' : 'STOCK_OUT';
      const cost = parseFloat(currentInv.cost_price || 0);
      const totalAmount = Math.abs(amountToAdd) * cost;

      await client.query(`
        INSERT INTO stock_transactions (
          product_id,
          supplier_id,
          transaction_type,
          quantity,
          unit_price,
          total_amount,
          reference_id,
          reference_type
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `, [
        currentInv.product_id,
        currentInv.supplier_id || null,
        txType,
        amountToAdd,
        cost,
        totalAmount,
        `RESTOCK-${Date.now().toString().slice(-6)}`,
        'RESTOCK'
      ]);
    }

    await client.query('COMMIT');

    return res.json({
      success: true,
      message: `Stock updated successfully. New quantity: ${newStock}`,
      newQuantity: newStock,
      stock_status: getStockStatus(newStock, newReorder)
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error updating inventory:', error);
    return res.status(500).json({ success: false, message: error.message });
  } finally {
    client.release();
  }
};
