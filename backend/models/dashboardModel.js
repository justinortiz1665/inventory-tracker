
const pool = require("../database");

const getLowStockItems = async () => {
    const { rows } = await pool.query(
        "SELECT * FROM inventory WHERE quantity <= min_threshold ORDER BY quantity ASC LIMIT 3"
    );
    return rows;
};

const getCategoryCosts = async () => {
    const { rows } = await pool.query(`
        SELECT 
            category,
            SUM(price * quantity) as total_cost
        FROM inventory 
        GROUP BY category
        ORDER BY total_cost DESC
    `);
    return rows;
};

const getRecentTransactions = async () => {
    const { rows } = await pool.query(
        "SELECT * FROM inventory ORDER BY created_at DESC LIMIT 3"
    );
    return rows;
};

module.exports = { getLowStockItems, getCategoryCosts, getRecentTransactions };
