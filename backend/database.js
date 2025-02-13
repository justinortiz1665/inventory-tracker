<<<<<<< HEAD
const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./inventory.db", (err) => {
  if (err) {
    console.error("Database connection failed:", err.message);
  } else {
    console.log("Connected to SQLite database.");
  }
});

module.exports = db;
=======
const { Pool } = require("pg");
const dotenv = require("dotenv");

dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false, // Required for Supabase
    }
});

pool.connect()
    .then(() => console.log("✅ Database connected successfully"))
    .catch(err => console.error("❌ Database connection error:", err));

module.exports = pool;
>>>>>>> 17ae09cc (Initial commit of inventory tracker progress)
