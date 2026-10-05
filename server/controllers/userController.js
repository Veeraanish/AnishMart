const pool = require("../config/db");
const bcrypt = require("bcryptjs");

const registerUser = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            role
        } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message:
                    "Name, email and password are required"
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message:
                    "Password must be at least 6 characters"
            });
        }

        const cleanEmail =
            email.trim().toLowerCase();

        const [existingUser] =
            await pool.query(
                "SELECT id FROM users WHERE email = ?",
                [cleanEmail]
            );

        if (existingUser.length > 0) {
            return res.status(409).json({
                success: false,
                message:
                    "Email already registered"
            });
        }

        const hashedPassword =
            await bcrypt.hash(
                password,
                10
            );

        const userRole =
            role === "seller"
                ? "seller"
                : "buyer";

        await pool.query(
            `INSERT INTO users
             (name, email, password, role)
             VALUES (?, ?, ?, ?)`,
            [
                name.trim(),
                cleanEmail,
                hashedPassword,
                userRole
            ]
        );

        return res.status(201).json({
            success: true,
            message:
                "User registered successfully"
        });

    } catch (error) {

        console.error(
            "REGISTER ERROR:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


const loginUser = async (req, res) => {
    try {

        const {
            email,
            password
        } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message:
                    "Email and password are required"
            });
        }

        const [users] =
            await pool.query(
                `SELECT
                    id,
                    name,
                    email,
                    password,
                    role
                 FROM users
                 WHERE email = ?`,
                [
                    email
                        .trim()
                        .toLowerCase()
                ]
            );

        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message:
                    "Invalid email or password"
            });
        }

        const user =
            users[0];

        const passwordMatch =
            await bcrypt.compare(
                password,
                user.password
            );

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message:
                    "Invalid email or password"
            });
        }

        const sessionUser = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        };

        req.session.regenerate(
            error => {

                if (error) {
                    console.error(
                        "SESSION REGENERATE ERROR:",
                        error.message
                    );

                    return res.status(500).json({
                        success: false,
                        message:
                            "Unable to create login session"
                    });
                }

                req.session.user =
                    sessionUser;

                req.session.save(
                    saveError => {

                        if (saveError) {
                            console.error(
                                "SESSION SAVE ERROR:",
                                saveError.message
                            );

                            return res.status(500).json({
                                success: false,
                                message:
                                    "Unable to save login session"
                            });
                        }

                        return res.json({
                            success: true,
                            message:
                                "Login successful",
                            user:
                                sessionUser
                        });
                    }
                );
            }
        );

    } catch (error) {

        console.error(
            "LOGIN ERROR:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


const logoutUser = (req, res) => {

    if (!req.session) {
        return res.json({
            success: true,
            message: "Logged out"
        });
    }

    req.session.destroy(
        error => {

            if (error) {

                console.error(
                    "LOGOUT ERROR:",
                    error.message
                );

                return res.status(500).json({
                    success: false,
                    message:
                        "Unable to logout"
                });
            }

            res.clearCookie(
                "anishmart.sid",
                {
                    path: "/"
                }
            );

            return res.json({
                success: true,
                message:
                    "Logged out successfully"
            });
        }
    );
};


const getSessionUser = (req, res) => {

    return res.json({
        success: true,
        user:
            req.session.user
    });
};


// Public email-only password reset is unsafe.
// User can change password from Profile after login.
const resetPassword = async (req, res) => {

    return res.status(403).json({
        success: false,
        message:
            "For security, password reset is disabled in this demo. Login and use Change Password from your profile."
    });
};


const updateProfile = async (req, res) => {

    try {

        const userId =
            Number(req.params.id);

        const {
            name
        } = req.body;

        if (
            !Number.isInteger(userId) ||
            userId <= 0
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid user ID"
            });
        }

        if (!name || !name.trim()) {
            return res.status(400).json({
                success: false,
                message:
                    "Name is required"
            });
        }

        const cleanName =
            name.trim();

        if (cleanName.length > 100) {
            return res.status(400).json({
                success: false,
                message:
                    "Name is too long"
            });
        }

        const [users] =
            await pool.query(
                `SELECT id
                 FROM users
                 WHERE id = ?`,
                [userId]
            );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message:
                    "User not found"
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
                `SELECT
                    id,
                    name,
                    email,
                    role
                 FROM users
                 WHERE id = ?`,
                [userId]
            );

        const updatedUser =
            updatedUsers[0];

        if (
            req.session?.user &&
            Number(
                req.session.user.id
            ) === userId
        ) {
            req.session.user.name =
                updatedUser.name;
        }

        return res.json({
            success: true,
            message:
                "Profile updated successfully",
            user:
                updatedUser
        });

    } catch (error) {

        console.error(
            "UPDATE PROFILE ERROR:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to update profile"
        });
    }
};


const changePassword = async (req, res) => {

    try {

        const userId =
            Number(req.params.id);

        const {
            currentPassword,
            newPassword
        } = req.body;

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
                `SELECT id, password
                 FROM users
                 WHERE id = ?`,
                [userId]
            );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message:
                    "User not found"
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
            `UPDATE users
             SET password = ?
             WHERE id = ?`,
            [
                hashedPassword,
                userId
            ]
        );

        return res.json({
            success: true,
            message:
                "Password changed successfully"
        });

    } catch (error) {

        console.error(
            "CHANGE PASSWORD ERROR:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to change password"
        });
    }
};


module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    getSessionUser,
    resetPassword,
    updateProfile,
    changePassword
};