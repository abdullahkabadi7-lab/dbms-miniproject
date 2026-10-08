const db = require('../db');

// GET /api/categories
exports.getCategories = async (req, res) => {
  try {
    const query = `
      SELECT 
        c.category_id,
        c.category_name,
        c.category_name AS name,
        LOWER(REPLACE(c.category_name, ' ', '-')) AS slug,
        c.description,
        COUNT(p.product_id)::int AS product_count
      FROM categories c
      LEFT JOIN products p ON c.category_id = p.category_id
      GROUP BY c.category_id, c.category_name, c.description
      ORDER BY c.category_id ASC
    `;
    const result = await db.query(query);
    return res.json({ success: true, categories: result.rows });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/categories
exports.createCategory = async (req, res) => {
  try {
    const { name, category_name, description = '' } = req.body;
    const catName = category_name || name;

    if (!catName) {
      return res.status(400).json({ success: false, message: 'Category name is required' });
    }

    const query = `
      INSERT INTO categories (category_name, description)
      VALUES ($1, $2)
      RETURNING *, category_name AS name
    `;
    const result = await db.query(query, [catName, description]);
    return res.status(201).json({ success: true, category: result.rows[0] });
  } catch (error) {
    console.error('Error creating category:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/categories/:id
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category_name, description } = req.body;
    const catName = category_name || name;

    const query = `
      UPDATE categories
      SET category_name = COALESCE($1, category_name),
          description = COALESCE($2, description)
      WHERE category_id::text = $3
      RETURNING *, category_name AS name
    `;
    const result = await db.query(query, [catName || null, description !== undefined ? description : null, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    return res.json({ success: true, category: result.rows[0] });
  } catch (error) {
    console.error('Error updating category:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/categories/:id
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if products exist in category
    const prodCheck = await db.query('SELECT COUNT(*)::int AS count FROM products WHERE category_id::text = $1', [id]);
    if (prodCheck.rows[0].count > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category: ${prodCheck.rows[0].count} product(s) are linked to it (Foreign Key Constraint RESTRICT).`
      });
    }

    const result = await db.query('DELETE FROM categories WHERE category_id::text = $1 RETURNING category_id', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    return res.json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
