const express = require("express");
const { sql, dbConfig } = require("../config/database");

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const pool = await sql.connect(dbConfig);

        const result = await pool.request().query(`
            SELECT
                Id,
                Asset,
                AssetId,
                Type,
                AssignedTo,
                Date,
                Status,
                CreatedAt
            FROM Maintenance
            ORDER BY Id DESC
        `);

        res.json({
            success: true,
            maintenance: result.recordset
        });
    } catch (error) {
        console.error("Get maintenance records error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to get maintenance records",
            error: error.message
        });
    }
});

router.post("/", async (req, res) => {
    try {
        const {
            asset,
            assetId,
            type,
            assignedTo,
            date,
            status
        } = req.body;

        if (!asset || !assetId || !type || !assignedTo || !date || !status) {
            return res.status(400).json({
                success: false,
                message: "All maintenance fields are required"
            });
        }

        const pool = await sql.connect(dbConfig);

        const assetCheck = await pool
            .request()
            .input("AssetTag", sql.NVarChar(50), assetId)
            .query(`
                SELECT Id, AssetName, AssetTag
                FROM Assets
                WHERE AssetTag = @AssetTag
            `);

        if (assetCheck.recordset.length === 0) {
            return res.status(400).json({
                success: false,
                message: `Asset with Asset Tag "${assetId}" does not exist`
            });
        }

        const result = await pool
            .request()
            .input("Asset", sql.NVarChar(100), asset)
            .input("AssetId", sql.NVarChar(50), assetId)
            .input("Type", sql.NVarChar(50), type)
            .input("AssignedTo", sql.NVarChar(100), assignedTo)
            .input("Date", sql.Date, date)
            .input("Status", sql.NVarChar(50), status)
            .query(`
                INSERT INTO Maintenance
                (
                    Asset,
                    AssetId,
                    Type,
                    AssignedTo,
                    Date,
                    Status
                )
                OUTPUT INSERTED.*
                VALUES
                (
                    @Asset,
                    @AssetId,
                    @Type,
                    @AssignedTo,
                    @Date,
                    @Status
                )
            `);

        res.status(201).json({
            success: true,
            message: "Maintenance record created successfully",
            maintenance: result.recordset[0]
        });
    } catch (error) {
        console.error("Create maintenance record error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to create maintenance record",
            error: error.message
        });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const {
            asset,
            assetId,
            type,
            assignedTo,
            date,
            status
        } = req.body;

        if (!asset || !assetId || !type || !assignedTo || !date || !status) {
            return res.status(400).json({
                success: false,
                message: "All maintenance fields are required"
            });
        }

        const pool = await sql.connect(dbConfig);

        const assetCheck = await pool
            .request()
            .input("AssetTag", sql.NVarChar(50), assetId)
            .query(`
                SELECT Id, AssetName, AssetTag
                FROM Assets
                WHERE AssetTag = @AssetTag
            `);

        if (assetCheck.recordset.length === 0) {
            return res.status(400).json({
                success: false,
                message: `Asset with Asset Tag "${assetId}" does not exist`
            });
        }

        const result = await pool
            .request()
            .input("Id", sql.Int, Number(id))
            .input("Asset", sql.NVarChar(100), asset)
            .input("AssetId", sql.NVarChar(50), assetId)
            .input("Type", sql.NVarChar(50), type)
            .input("AssignedTo", sql.NVarChar(100), assignedTo)
            .input("Date", sql.Date, date)
            .input("Status", sql.NVarChar(50), status)
            .query(`
                UPDATE Maintenance
                SET
                    Asset = @Asset,
                    AssetId = @AssetId,
                    Type = @Type,
                    AssignedTo = @AssignedTo,
                    Date = @Date,
                    Status = @Status
                OUTPUT INSERTED.*
                WHERE Id = @Id
            `);

        if (result.recordset.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Maintenance record not found"
            });
        }

        res.json({
            success: true,
            message: "Maintenance record updated successfully",
            maintenance: result.recordset[0]
        });
    } catch (error) {
        console.error("Update maintenance record error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update maintenance record",
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
                DELETE FROM Maintenance
                OUTPUT DELETED.*
                WHERE Id = @Id
            `);

        if (result.recordset.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Maintenance record not found"
            });
        }

        res.json({
            success: true,
            message: "Maintenance record deleted successfully",
            maintenance: result.recordset[0]
        });
    } catch (error) {
        console.error("Delete maintenance record error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to delete maintenance record",
            error: error.message
        });
    }
});

module.exports = router;