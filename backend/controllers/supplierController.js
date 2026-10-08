const db = require('../db');

// GET /api/suppliers
exports.getSuppliers = async (req, res) => {
  try {
    const query = 'SELECT * FROM suppliers ORDER BY supplier_id ASC';
    const result = await db.query(query);
    return res.json({ success: true, suppliers: result.rows });
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/suppliers
exports.createSupplier = async (req, res) => {
  try {
    const { supplier_name, contact_person = '', phone = '', email = '', address = '' } = req.body;

    if (!supplier_name) {
      return res.status(400).json({ success: false, message: 'Supplier name is required' });
    }

    const query = `
      INSERT INTO suppliers (supplier_name, contact_person, phone, email, address)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const result = await db.query(query, [supplier_name, contact_person, phone, email, address]);
    return res.status(201).json({ success: true, supplier: result.rows[0] });
  } catch (error) {
    console.error('Error creating supplier:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/suppliers/:id
exports.updateSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const { supplier_name, contact_person, phone, email, address } = req.body;

    const query = `
      UPDATE suppliers
      SET supplier_name = COALESCE($1, supplier_name),
          contact_person = COALESCE($2, contact_person),
          phone = COALESCE($3, phone),
          email = COALESCE($4, email),
          address = COALESCE($5, address)
      WHERE supplier_id::text = $6
      RETURNING *
    `;
    const result = await db.query(query, [
      supplier_name || null,
      contact_person !== undefined ? contact_person : null,
      phone !== undefined ? phone : null,
      email !== undefined ? email : null,
      address !== undefined ? address : null,
      id
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Supplier not found' });
    }
    return res.json({ success: true, supplier: result.rows[0] });
  } catch (error) {
    console.error('Error updating supplier:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/suppliers/:id
exports.deleteSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM suppliers WHERE supplier_id::text = $1 RETURNING supplier_id', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Supplier not found' });
    }
    return res.json({ success: true, message: 'Supplier deleted successfully' });
  } catch (error) {
    console.error('Error deleting supplier:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
