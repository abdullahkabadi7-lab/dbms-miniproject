const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
  host: process.env.PGHOST || 'localhost',
  port: parseInt(process.env.PGPORT || '5432', 10),
  database: process.env.PGDATABASE || 'smartmart',
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD || 'postgres',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client:', err);
});

// Helper for single queries
const query = (text, params) => pool.query(text, params);

// Connection test helper
const testConnection = async () => {
  try {
    const res = await pool.query('SELECT current_database(), current_user, version()');
    console.log(`[PostgreSQL] Connected to database: "${res.rows[0].current_database}" as user: "${res.rows[0].current_user}"`);
    return true;
  } catch (err) {
    console.warn(`[PostgreSQL Warning] Could not connect to PostgreSQL (${err.message}).`);
    console.warn(`Ensure PostgreSQL is running and update credentials in backend/.env if needed.`);
    return false;
  }
};

module.exports = {
  pool,
  query,
  testConnection
};
