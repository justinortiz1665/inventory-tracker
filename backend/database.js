
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Test the connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('⚠️ Error connecting to the database:', err.message);
    return;
  }
  console.log('✅ Successfully connected to Supabase database');
  release();
});

module.exports = pool;
