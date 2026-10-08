const fs = require('fs');
const path = require('path');
const { pool } = require('./db');

async function setupDatabase() {
  console.log('🔄 Initializing PostgreSQL Database for SmartMart...');

  const schemaPath = path.join(__dirname, '..', 'database', 'schema.sql');
  const sampleDataPath = path.join(__dirname, '..', 'database', 'sample_data.sql');

  try {
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    console.log('📦 Executing schema.sql (Creating 8 tables, indexes, constraints)...');
    await pool.query(schemaSql);
    console.log('✅ schema.sql executed successfully.');

    const sampleDataSql = fs.readFileSync(sampleDataPath, 'utf8');
    console.log('🌱 Executing sample_data.sql (Seeding realistic records)...');
    await pool.query(sampleDataSql);
    console.log('✅ sample_data.sql executed successfully.');

    console.log('🎉 SmartMart database initialized successfully with all 8 tables and sample data!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    console.error('Make sure PostgreSQL is running and credentials in backend/.env are correct.');
    process.exit(1);
  }
}

setupDatabase();
