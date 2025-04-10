
require('dotenv').config();
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Test the connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('⚠️ Error connecting to the database:', err.message);
    console.error('Database URL:', process.env.DATABASE_URL ? 'Is set' : 'Is not set');
    return;
  }
  console.log('✅ Successfully connected to Supabase database');
  release();
});

module.exports = pool;
