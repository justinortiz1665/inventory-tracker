
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pool = require("./database");

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: true,
  credentials: true
}));

// Import routes
const authRoutes = require("./routes/authRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

// Mount routes with /api prefix
app.use("/api/auth", authRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Debug routes
app.get("/api/test", (req, res) => {
  res.json({ message: "API is working" });
});

app.get("/", (req, res) => {
  res.send("Inventory Tracker API is running...");
});

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log('✅ Dashboard routes available at:');
  console.log(`   - /api/dashboard/low-stock`);
  console.log(`   - /api/dashboard/category-costs`);
  console.log(`   - /api/dashboard/recent-transactions`);
});
