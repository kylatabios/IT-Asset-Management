const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { sql, dbConfig } = require("./config/database");

const authRoutes = require("./routes/authRoutes");
const assetRoutes = require("./routes/assetRoutes");
const userRoutes = require("./routes/userRoutes");
const maintenanceRoutes = require("./routes/maintenanceRoutes");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/assets", assetRoutes);
app.use("/api/users", userRoutes);
app.use("/api/maintenance", maintenanceRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "IT Asset Management API is running"
    });
});

app.get("/api/test-db", async (req, res) => {
    try {
        const pool = await sql.connect(dbConfig);

        const result = await pool
            .request()
            .query("SELECT DB_NAME() AS databaseName");

        res.json({
            success: true,
            message: "Database connected successfully",
            database: result.recordset[0].databaseName
        });
    } catch (error) {
        console.error("Database connection error:", error);

        res.status(500).json({
            success: false,
            message: "Database connection failed",
            error: error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});