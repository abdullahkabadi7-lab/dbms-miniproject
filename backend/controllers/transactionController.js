const db = require('../db');

// GET /api/transactions
exports.getTransactions = async (req, res) => {
  try {
    const { type, productId } = req.query;
    let queryText = `
      SELECT 
        st.transaction_id,
        st.product_id,
        p.product_name,
        p.product_name AS name,
        st.supplier_id,
        s.supplier_name,
        st.transaction_type,
        st.quantity,
        CAST(st.unit_price AS FLOAT) AS unit_price,
        CAST(st.total_amount AS FLOAT) AS total_amount,
        st.reference_id,
        st.reference_type,
        st.reference_at,
        st.created_at,
        st.created_at AS transaction_date,
        CONCAT(st.transaction_type, ' of ', ABS(st.quantity), ' units [Ref: ', COALESCE(st.reference_id, 'N/A'), ']') AS notes
      FROM stock_transactions st
      JOIN products p ON st.product_id = p.product_id
      LEFT JOIN suppliers s ON st.supplier_id = s.supplier_id
      WHERE 1=1
    `;
    const params = [];

    if (type && type !== 'all') {
      params.push(type);
      queryText += ` AND st.transaction_type = $${params.length}`;
    }

    if (productId) {
      params.push(productId);
      queryText += ` AND st.product_id::text = $${params.length}`;
    }

    queryText += ` ORDER BY st.created_at DESC`;

    const result = await db.query(queryText, params);
    const transactions = result.rows.map((row) => ({
      ...row,
      transaction_id: `TXN-${row.transaction_id}`,
      raw_transaction_id: row.transaction_id
    }));

    return res.json({ success: true, transactions });
  } catch (error) {
    console.error('Error fetching stock transactions:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
