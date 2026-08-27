
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sql, dbConfig } = require("../config/database");

const router = express.Router();

router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: "Username and password are required"
            });
        }

        const pool = await sql.connect(dbConfig);

        const result = await pool
            .request()
            .input("Email", sql.NVarChar, username)
            .query(`
                SELECT
                    Id,
                    FullName,
                    Email,
                    PasswordHash
                FROM Users
                WHERE Email = @Email
            `);

        if (result.recordset.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Invalid username or password"
            });
        }

        const user = result.recordset[0];

        const passwordMatch = await bcrypt.compare(
            password,
            user.PasswordHash
        );

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid username or password"
            });
        }

        const token = jwt.sign(
            {
                id: user.Id,
                email: user.Email,
                role: "admin"
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "8h"
            }
        );

        res.json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user.Id,
                fullName: user.FullName,
                email: user.Email,
                role: "admin"
            }
        });
    } catch (error) {
        console.error("Login error:", error);

        res.status(500).json({
            success: false,
            message: "Login failed",
            error: error.message
        });
    }
});

module.exports = router;

