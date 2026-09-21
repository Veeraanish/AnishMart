const bcrypt = require("bcryptjs");
const pool = require("./config/db");

async function createAdmin() {
    try {
        const name = "Admin";
        const email = "admin@anishmart.com";
        const password = "Admin@123";

        const [existing] = await pool.query(
            "SELECT id FROM users WHERE email = ?",
            [email]
        );

        if (existing.length > 0) {
            console.log("Admin account already exists.");
            process.exit();
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await pool.query(
            `
            INSERT INTO users
            (name, email, password, role)
            VALUES (?, ?, ?, 'admin')
            `,
            [name, email, hashedPassword]
        );

        console.log("✅ Admin account created");
        console.log("Email:", email);
        console.log("Password:", password);

        process.exit();

    } catch (error) {
        console.error("ADMIN CREATE ERROR:", error);
        process.exit(1);
    }
}

createAdmin();