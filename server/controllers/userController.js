const pool = require("../config/db");
const bcrypt = require("bcryptjs");


// ===============================
// REGISTER USER
// ===============================
const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email and password are required"
            });
        }

        const [existingUser] = await pool.query(
            "SELECT id FROM users WHERE email = ?",
            [email]
        );

        if (existingUser.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Email already registered"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const userRole =
            role === "seller"
                ? "seller"
                : "buyer";

        await pool.query(
            "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
            [name, email, hashedPassword, userRole]
        );

        res.status(201).json({
            success: true,
            message: "User registered successfully"
        });

    } catch (error) {
        console.error("REGISTER ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// ===============================
// LOGIN USER
// ===============================
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        const [users] = await pool.query(
            "SELECT id, name, email, password, role FROM users WHERE email = ?",
            [email]
        );

        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const user = users[0];

        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        res.json({
            success: true,
            message: "Login successful",

            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error("LOGIN ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// ===============================
// RESET PASSWORD - DEMO VERSION
// ===============================
const resetPassword = async (req, res) => {
    try {
        const {
            email,
            newPassword
        } = req.body;

        if (!email || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Email and new password are required"
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters"
            });
        }

        const [users] = await pool.query(
            "SELECT id FROM users WHERE email = ?",
            [email]
        );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No account found with this email"
            });
        }

        const hashedPassword =
            await bcrypt.hash(
                newPassword,
                10
            );

        await pool.query(
            "UPDATE users SET password = ? WHERE email = ?",
            [
                hashedPassword,
                email
            ]
        );

        res.json({
            success: true,
            message: "Password reset successfully"
        });

    } catch (error) {
        console.error(
            "RESET PASSWORD ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to reset password"
        });
    }
};


// ===============================
// UPDATE PROFILE
// ===============================
const updateProfile = async (req, res) => {
    try {
        const userId =
            Number(req.params.id);

        const { name } = req.body;

        if (
            !Number.isInteger(userId) ||
            userId <= 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID"
            });
        }

        if (!name || !name.trim()) {
            return res.status(400).json({
                success: false,
                message: "Name is required"
            });
        }

        const cleanName =
            name.trim();

        if (cleanName.length > 100) {
            return res.status(400).json({
                success: false,
                message: "Name is too long"
            });
        }

        const [users] =
            await pool.query(
                `SELECT id, name, email, role
                 FROM users
                 WHERE id = ?`,
                [userId]
            );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        await pool.query(
            `UPDATE users
             SET name = ?
             WHERE id = ?`,
            [
                cleanName,
                userId
            ]
        );

        const [updatedUsers] =
            await pool.query(
                `SELECT id, name, email, role
                 FROM users
                 WHERE id = ?`,
                [userId]
            );

        const updatedUser =
            updatedUsers[0];

        res.json({
            success: true,
            message: "Profile updated successfully",

            user: {
                id: updatedUser.id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role
            }
        });

    } catch (error) {
        console.error(
            "UPDATE PROFILE ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to update profile"
        });
    }
};


// ===============================
// CHANGE PASSWORD
// ===============================
const changePassword = async (req, res) => {
    try {
        const userId =
            Number(req.params.id);

        const {
            currentPassword,
            newPassword
        } = req.body;

        if (
            !Number.isInteger(userId) ||
            userId <= 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID"
            });
        }

        if (
            !currentPassword ||
            !newPassword
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Current password and new password are required"
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message:
                    "New password must be at least 6 characters"
            });
        }

        const [users] =
            await pool.query(
                "SELECT id, password FROM users WHERE id = ?",
                [userId]
            );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const user =
            users[0];

        const passwordMatch =
            await bcrypt.compare(
                currentPassword,
                user.password
            );

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message:
                    "Current password is incorrect"
            });
        }

        const samePassword =
            await bcrypt.compare(
                newPassword,
                user.password
            );

        if (samePassword) {
            return res.status(400).json({
                success: false,
                message:
                    "New password must be different from current password"
            });
        }

        const hashedPassword =
            await bcrypt.hash(
                newPassword,
                10
            );

        await pool.query(
            "UPDATE users SET password = ? WHERE id = ?",
            [
                hashedPassword,
                userId
            ]
        );

        res.json({
            success: true,
            message:
                "Password changed successfully"
        });

    } catch (error) {
        console.error(
            "CHANGE PASSWORD ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Failed to change password"
        });
    }
};


// ===============================
// EXPORTS
// ===============================
module.exports = {
    registerUser,
    loginUser,
    resetPassword,
    updateProfile,
    changePassword
};