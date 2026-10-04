const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const pool = require("./config/db");

const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

const PORT = process.env.PORT || 5000;

// ==========================================
// MIDDLEWARE
// ==========================================

app.use(cors());
app.use(express.json());

// Request logger
app.use((req, res, next) => {
    console.log(
        "REQUEST:",
        req.method,
        req.url
    );

    next();
});

// ==========================================
// FRONTEND STATIC FILES
// ==========================================

app.use(
    express.static(
        path.join(
            __dirname,
            "../client"
        )
    )
);

// ==========================================
// API ROUTES
// ==========================================

app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/admin", adminRoutes);




app.get("/api/v1/health", async (req, res) => {
    try {
        await pool.query("SELECT 1");

        res.json({
            success: true,
            message: "AnishMart API is running",
            status: "UP",
            db: "UP"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Database connection failed",
            status: "DOWN",
            db: "DOWN"
        });
    }
});

// ==========================================
// HOME PAGE
// ==========================================

app.get("/", (req, res) => {
    res.sendFile(
        path.join(
            __dirname,
            "../client/index.html"
        )
    );
});

// ==========================================
// START SERVER
// ==========================================

app.listen(PORT, () => {
    console.log(
        `AnishMart full application running on http://localhost:${PORT}`
    );
});

process.stdin.resume();