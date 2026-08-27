const express = require("express");
const bcrypt = require("bcrypt");
const { sql, dbConfig } = require("../config/database");

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const pool = await sql.connect(dbConfig);

        const result = await pool.request().query(`
            SELECT
                Id,
                FullName,
                Email,
                CreatedAt
            FROM Users
            ORDER BY Id DESC
        `);

        res.json({
            success: true,
            users: result.recordset
        });
    } catch (error) {
        console.error("Get users error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to get users",
            error: error.message
        });
    }
});

router.post("/", async (req, res) => {
    try {
        const { fullName, email, password } = req.body;

        if (!fullName || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Full name, email, and password are required"
            });
        }

        const pool = await sql.connect(dbConfig);

        const existingUser = await pool
            .request()
            .input("Email", sql.NVarChar, email)
            .query(`
                SELECT Id
                FROM Users
                WHERE Email = @Email
            `);

        if (existingUser.recordset.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Email is already registered"
            });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        await pool
            .request()
            .input("FullName", sql.NVarChar, fullName)
            .input("Email", sql.NVarChar, email)
            .input("PasswordHash", sql.NVarChar, passwordHash)
            .query(`
                INSERT INTO Users
                (FullName, Email, PasswordHash)
                VALUES
                (@FullName, @Email, @PasswordHash)
            `);

        res.status(201).json({
            success: true,
            message: "User created successfully"
        });
    } catch (error) {
        console.error("Create user error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to create user",
            error: error.message
        });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const pool = await sql.connect(dbConfig);

        const result = await pool
            .request()
            .input("Id", sql.Int, Number(req.params.id))
            .query(`
                DELETE FROM Users
                WHERE Id = @Id
            `);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.json({
            success: true,
            message: "User deleted successfully"
        });
    } catch (error) {
        console.error("Delete user error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to delete user",
            error: error.message
        });
    }
});

module.exports = router;