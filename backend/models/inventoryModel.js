<<<<<<< HEAD
const db = require("../database");

db.run(`
  CREATE TABLE IF NOT EXISTS inventory (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT,
    quantity INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`);

module.exports = db;
=======
const pool = require("../database"); // Connects to Supabase DB

// Get all inventory items
const getAllInventory = async () => {
    const { rows } = await pool.query("SELECT * FROM inventory ORDER BY created_at DESC");
    return rows;
};

// Get inventory item by ID
const getInventoryById = async (id) => {
    const { rows } = await pool.query("SELECT * FROM inventory WHERE id = $1", [id]);
    return rows[0];
};

// Add a new inventory item
const addInventoryItem = async (item) => {
    const { item_number, item_name, category, vendor, quantity, unit, min_threshold, max_threshold, price } = item;
    const { rows } = await pool.query(
        `INSERT INTO inventory (item_number, item_name, category, vendor, quantity, unit, min_threshold, max_threshold, price) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
        [item_number, item_name, category, vendor, quantity, unit, min_threshold, max_threshold, price]
    );
    return rows[0];
};

// Update inventory item by ID
const updateInventoryItem = async (id, updatedItem) => {
    const { item_name, category, vendor, quantity, unit, min_threshold, max_threshold, price } = updatedItem;
    const { rows } = await pool.query(
        `UPDATE inventory SET 
            item_name = $1, 
            category = $2, 
            vendor = $3, 
            quantity = $4, 
            unit = $5, 
            min_threshold = $6, 
            max_threshold = $7, 
            price = $8
        WHERE id = $9 RETURNING *`,
        [item_name, category, vendor, quantity, unit, min_threshold, max_threshold, price, id]
    );
    return rows[0];
};

// Delete inventory item by ID
const deleteInventoryItem = async (id) => {
    const { rows } = await pool.query("DELETE FROM inventory WHERE id = $1 RETURNING *", [id]);
    return rows[0];
};

module.exports = { getAllInventory, getInventoryById, addInventoryItem, updateInventoryItem, deleteInventoryItem };
>>>>>>> 17ae09cc (Initial commit of inventory tracker progress)
