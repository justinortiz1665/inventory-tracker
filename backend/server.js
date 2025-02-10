const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const inventoryRoutes = require("./routes/inventoryRoutes");
app.use("/api", inventoryRoutes);

app.get("/", (req, res) => {
    res.send("Inventory Tracker API is running...");
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));