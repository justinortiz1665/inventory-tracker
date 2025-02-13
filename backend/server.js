const express = require("express");
const cors = require("cors");
<<<<<<< HEAD
=======
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");

// Load environment variables
dotenv.config();
>>>>>>> 17ae09cc (Initial commit of inventory tracker progress)

const app = express();
app.use(express.json());
app.use(cors());

<<<<<<< HEAD
const inventoryRoutes = require("./routes/inventoryRoutes");
app.use("/api", inventoryRoutes);
=======
// Routes
app.use("/api/auth", authRoutes);
app.use("/api/inventory", inventoryRoutes);
>>>>>>> 17ae09cc (Initial commit of inventory tracker progress)

app.get("/", (req, res) => {
    res.send("Inventory Tracker API is running...");
});

<<<<<<< HEAD
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
=======
// Start Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
>>>>>>> 17ae09cc (Initial commit of inventory tracker progress)
