const pool = require("./config/db");

async function testConnection() {
    try {
        const connection = await pool.getConnection();

        console.log("✅ MySQL connected successfully!");

        connection.release();
        await pool.end();
    } catch (error) {
        console.error("❌ MySQL connection failed!");
        console.error(error.message);
    }
}

testConnection();