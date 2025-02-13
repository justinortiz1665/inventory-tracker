const pool = require("../database");
const bcrypt = require("bcryptjs");

// Find user by email
const findUserByEmail = async (email) => {
    const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    return rows[0];
};

// Find user by ID
const findUserById = async (id) => {
    const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    return rows[0];
};

// Create a new user
const createUser = async (username, email, password, role = "user") => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const { rows } = await pool.query(
        "INSERT INTO users (username, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING *",
        [username, email, hashedPassword, role]
    );
    return rows[0];
};

// Verify password
const verifyPassword = async (enteredPassword, storedPassword) => {
    return await bcrypt.compare(enteredPassword, storedPassword);
};

module.exports = { findUserByEmail, findUserById, createUser, verifyPassword };
