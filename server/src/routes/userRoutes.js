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

        const result = await pool
            .request()
            .input("FullName", sql.NVarChar, fullName)
            .input("Email", sql.NVarChar, email)
            .input("PasswordHash", sql.NVarChar, passwordHash)
            .query(`
                INSERT INTO Users
                (
                    FullName,
                    Email,
                    PasswordHash
                )
                OUTPUT
                    INSERTED.Id,
                    INSERTED.FullName,
                    INSERTED.Email,
                    INSERTED.CreatedAt
                VALUES
                (
                    @FullName,
                    @Email,
                    @PasswordHash
                )
            `);

        res.status(201).json({
            success: true,
            message: "User created successfully",
            user: result.recordset[0]
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

router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { fullName, email, password } = req.body;

        if (!fullName || !email) {
            return res.status(400).json({
                success: false,
                message: "Full name and email are required"
            });
        }

        const pool = await sql.connect(dbConfig);

        const existingUser = await pool
            .request()
            .input("Id", sql.Int, Number(id))
            .query(`
                SELECT Id
                FROM Users
                WHERE Id = @Id
            `);

        if (existingUser.recordset.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const emailCheck = await pool
            .request()
            .input("Id", sql.Int, Number(id))
            .input("Email", sql.NVarChar, email)
            .query(`
                SELECT Id
                FROM Users
                WHERE Email = @Email
                AND Id <> @Id
            `);

        if (emailCheck.recordset.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Email is already registered"
            });
        }

        if (password) {
            const passwordHash = await bcrypt.hash(password, 10);

            const result = await pool
                .request()
                .input("Id", sql.Int, Number(id))
                .input("FullName", sql.NVarChar, fullName)
                .input("Email", sql.NVarChar, email)
                .input("PasswordHash", sql.NVarChar, passwordHash)
                .query(`
                    UPDATE Users
                    SET
                        FullName = @FullName,
                        Email = @Email,
                        PasswordHash = @PasswordHash
                    OUTPUT
                        INSERTED.Id,
                        INSERTED.FullName,
                        INSERTED.Email,
                        INSERTED.CreatedAt
                    WHERE Id = @Id
                `);

            return res.json({
                success: true,
                message: "User updated successfully",
                user: result.recordset[0]
            });
        }

        const result = await pool
            .request()
            .input("Id", sql.Int, Number(id))
            .input("FullName", sql.NVarChar, fullName)
            .input("Email", sql.NVarChar, email)
            .query(`
                UPDATE Users
                SET
                    FullName = @FullName,
                    Email = @Email
                OUTPUT
                    INSERTED.Id,
                    INSERTED.FullName,
                    INSERTED.Email,
                    INSERTED.CreatedAt
                WHERE Id = @Id
            `);

        res.json({
            success: true,
            message: "User updated successfully",
            user: result.recordset[0]
        });
    } catch (error) {
        console.error("Update user error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update user",
            error: error.message
        });
    }
});

router.put("/:id/password", async (req, res) => {
    try {
        const { id } = req.params;
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Current password and new password are required"
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
            .input("Id", sql.Int, Number(id))
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
            .input("Id", sql.Int, Number(id))
            .input("PasswordHash", sql.NVarChar, newPasswordHash)
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

router.delete("/:id", async (req, res) => {
    try {
        const pool = await sql.connect(dbConfig);

        const result = await pool
            .request()
            .input("Id", sql.Int, Number(req.params.id))
            .query(`
                DELETE FROM Users
                OUTPUT
                    DELETED.Id,
                    DELETED.FullName,
                    DELETED.Email
                WHERE Id = @Id
            `);

        if (result.recordset.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.json({
            success: true,
            message: "User deleted successfully",
            user: result.recordset[0]
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