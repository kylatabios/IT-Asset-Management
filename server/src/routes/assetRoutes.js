const express = require("express");
const { sql, dbConfig } = require("../config/database");

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const pool = await sql.connect(dbConfig);

        const result = await pool.request().query(`
            SELECT
                Id,
                AssetTag,
                AssetName,
                Category,
                Brand,
                Model,
                SerialNumber,
                Status,
                AssignedTo,
                PurchaseDate,
                CreatedAt
            FROM Assets
            ORDER BY Id DESC
        `);

        res.json({
            success: true,
            assets: result.recordset
        });
    } catch (error) {
        console.error("Get assets error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to get assets",
            error: error.message
        });
    }
});

router.post("/", async (req, res) => {
    try {
        const {
            assetTag,
            assetName,
            category,
            brand,
            model,
            serialNumber,
            status,
            assignedTo,
            purchaseDate
        } = req.body;

        if (!assetName || !category || !status) {
            return res.status(400).json({
                success: false,
                message: "Asset name, category, and status are required"
            });
        }

        const pool = await sql.connect(dbConfig);

        const result = await pool
            .request()
            .input("AssetTag", sql.NVarChar, assetTag || null)
            .input("AssetName", sql.NVarChar, assetName)
            .input("Category", sql.NVarChar, category)
            .input("Brand", sql.NVarChar, brand || null)
            .input("Model", sql.NVarChar, model || null)
            .input("SerialNumber", sql.NVarChar, serialNumber || null)
            .input("Status", sql.NVarChar, status)
            .input("AssignedTo", sql.NVarChar, assignedTo || null)
            .input("PurchaseDate", sql.Date, purchaseDate || null)
            .query(`
                INSERT INTO Assets
                (
                    AssetTag,
                    AssetName,
                    Category,
                    Brand,
                    Model,
                    SerialNumber,
                    Status,
                    AssignedTo,
                    PurchaseDate
                )
                OUTPUT INSERTED.*
                VALUES
                (
                    @AssetTag,
                    @AssetName,
                    @Category,
                    @Brand,
                    @Model,
                    @SerialNumber,
                    @Status,
                    @AssignedTo,
                    @PurchaseDate
                )
            `);

        res.status(201).json({
            success: true,
            message: "Asset created successfully",
            asset: result.recordset[0]
        });
    } catch (error) {
        console.error("Create asset error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to create asset",
            error: error.message
        });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const {
            assetTag,
            assetName,
            category,
            brand,
            model,
            serialNumber,
            status,
            assignedTo,
            purchaseDate
        } = req.body;

        if (!assetName || !category || !status) {
            return res.status(400).json({
                success: false,
                message: "Asset name, category, and status are required"
            });
        }

        const pool = await sql.connect(dbConfig);

        const result = await pool
            .request()
            .input("Id", sql.Int, Number(id))
            .input("AssetTag", sql.NVarChar, assetTag || null)
            .input("AssetName", sql.NVarChar, assetName)
            .input("Category", sql.NVarChar, category)
            .input("Brand", sql.NVarChar, brand || null)
            .input("Model", sql.NVarChar, model || null)
            .input("SerialNumber", sql.NVarChar, serialNumber || null)
            .input("Status", sql.NVarChar, status)
            .input("AssignedTo", sql.NVarChar, assignedTo || null)
            .input("PurchaseDate", sql.Date, purchaseDate || null)
            .query(`
                UPDATE Assets
                SET
                    AssetTag = @AssetTag,
                    AssetName = @AssetName,
                    Category = @Category,
                    Brand = @Brand,
                    Model = @Model,
                    SerialNumber = @SerialNumber,
                    Status = @Status,
                    AssignedTo = @AssignedTo,
                    PurchaseDate = @PurchaseDate
                OUTPUT INSERTED.*
                WHERE Id = @Id
            `);

        if (result.recordset.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Asset not found"
            });
        }

        res.json({
            success: true,
            message: "Asset updated successfully",
            asset: result.recordset[0]
        });
    } catch (error) {
        console.error("Update asset error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update asset",
            error: error.message
        });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const pool = await sql.connect(dbConfig);

        const result = await pool
            .request()
            .input("Id", sql.Int, Number(id))
            .query(`
                DELETE FROM Assets
                OUTPUT DELETED.*
                WHERE Id = @Id
            `);

        if (result.recordset.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Asset not found"
            });
        }

        res.json({
            success: true,
            message: "Asset deleted successfully",
            asset: result.recordset[0]
        });
    } catch (error) {
        console.error("Delete asset error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to delete asset",
            error: error.message
        });
    }
});

module.exports = router;