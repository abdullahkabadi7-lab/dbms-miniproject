const db = require('../db');

exports.register = async (req, res) => {
  try {
    const { full_name, fullName, email, password, role = 'customer', phone = '', address = '' } = req.body;
    const name = full_name || fullName;

    if (!name || !email) {
      return res.status(400).json({ success: false, message: 'Name and email are required.' });
    }

    // Check if user already exists
    const existing = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'User with this email already exists.' });
    }

    const defaultPassword = password || 'secret123';
    const insertQuery = `
      INSERT INTO users (full_name, email, password, role, phone, address)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING user_id, full_name, email, role, phone, address, created_at
    `;
    const result = await db.query(insertQuery, [name, email, defaultPassword, role, phone, address]);
    const user = result.rows[0];

    return res.status(201).json({ success: true, user });
  } catch (error) {
    console.error('Error registering user:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required.' });
    }

    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (result.rows.length === 0) {
      // Auto-register convenience for student demonstration if email is demo customer
      const defaultName = email.split('@')[0].replace('.', ' ');
      const formattedName = defaultName.charAt(0).toUpperCase() + defaultName.slice(1);
      const userRole = role || 'customer';
      
      const insertResult = await db.query(
        `INSERT INTO users (full_name, email, password, role, phone, address)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING user_id, full_name, email, role, phone, address, created_at`,
        [formattedName, email, password || 'demo123', userRole, '+1 (555) 000-0000', 'Demonstration Address']
      );
      return res.json({ success: true, user: insertResult.rows[0] });
    }

    const user = result.rows[0];
    delete user.password; // Do not return password hash
    return res.json({ success: true, user });
  } catch (error) {
    console.error('Error logging in:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    const id = req.query.id;
    if (!id) {
      // Default to demo customer user (Alex Morgan or first customer)
      const result = await db.query("SELECT user_id, full_name, email, role, phone, address, created_at FROM users WHERE role = 'customer' LIMIT 1");
      return res.json({ success: true, user: result.rows[0] });
    }

    const result = await db.query("SELECT user_id, full_name, email, role, phone, address, created_at FROM users WHERE user_id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    return res.json({ success: true, user: result.rows[0] });
  } catch (error) {
    console.error('Error fetching current user:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
