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

router.put("/change-password", async (req, res) => {
    try {
        const { userId, currentPassword, newPassword } = req.body;

        if (!userId || !currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "All password fields are required"
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: "New password must be at least 6 characters"
            });
        }

        const pool = await sql.connect(dbConfig);

        const result = await pool
            .request()
            .input("Id", sql.Int, userId)
            .query(`
                SELECT
                    Id,
                    PasswordHash
                FROM Users
                WHERE Id = @Id
            `);

        if (result.recordset.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const user = result.recordset[0];

        const passwordMatch = await bcrypt.compare(
            currentPassword,
            user.PasswordHash
        );

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Current password is incorrect"
            });
        }

        const newPasswordHash = await bcrypt.hash(
            newPassword,
            10
        );

        await pool
            .request()
            .input(
                "Id",
                sql.Int,
                userId
            )
            .input(
                "PasswordHash",
                sql.NVarChar,
                newPasswordHash
            )
            .query(`
                UPDATE Users
                SET PasswordHash = @PasswordHash
                WHERE Id = @Id
            `);

        res.json({
            success: true,
            message: "Password changed successfully"
        });
    } catch (error) {
        console.error("Change password error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to change password",
            error: error.message
        });
    }
});

module.exports = router;