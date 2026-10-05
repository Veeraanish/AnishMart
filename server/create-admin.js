const bcrypt = require("bcryptjs");
const pool = require("./config/db");
require("dotenv").config();

async function createAdmin() {
    try {
        const name =
            process.env.ADMIN_NAME || "Admin";

        const email =
            String(process.env.ADMIN_EMAIL || "")
                .trim()
                .toLowerCase();

        const password =
            String(process.env.ADMIN_PASSWORD || "");

        if (!email || !password) {
            throw new Error(
                "ADMIN_EMAIL and ADMIN_PASSWORD must be set in environment variables."
            );
        }

        if (password.length < 8) {
            throw new Error(
                "ADMIN_PASSWORD must be at least 8 characters."
            );
        }

        const [existing] = await pool.query(
            "SELECT id FROM users WHERE email = ?",
            [email]
        );

        const hashedPassword =
            await bcrypt.hash(password, 10);

        if (existing.length > 0) {
            await pool.query(
                `
                UPDATE users
                SET name = ?, password = ?, role = 'admin'
                WHERE email = ?
                `,
                [
                    name,
                    hashedPassword,
                    email
                ]
            );

            console.log(
                "✅ Admin account updated"
            );

        } else {
            await pool.query(
                `
                INSERT INTO users
                (name, email, password, role)
                VALUES (?, ?, ?, 'admin')
                `,
                [
                    name,
                    email,
                    hashedPassword
                ]
            );

            console.log(
                "✅ Admin account created"
            );
        }

        await pool.end();
        process.exit(0);

    } catch (error) {
        console.error(
            "ADMIN CREATE ERROR:",
            error.message
        );

        try {
            await pool.end();
        } catch {}

        process.exit(1);
    }
}

createAdmin();