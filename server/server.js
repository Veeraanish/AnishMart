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
const chatRoutes = require("./routes/chatRoutes");

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
// LEGACY API ROUTES
// Existing frontend continues to work
// ==========================================

app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/chat", chatRoutes);

// ==========================================
// VERSIONED API ROUTES
// PDF-required /api/v1/... endpoints
// ==========================================

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/reviews", reviewRoutes);
app.use("/api/v1/wishlist", wishlistRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/chat", chatRoutes);

// ==========================================
// HEALTH CHECK
// ==========================================

const healthCheck = async (req, res) => {
    try {
        await pool.query("SELECT 1");

        res.json({
            success: true,
            data: {
                status: "UP",
                db: "UP",
                application: "AnishMart"
            },
            error: null,

            // Kept for backward compatibility
            status: "UP",
            db: "UP"
        });

    } catch (error) {
        console.error(
            "HEALTH CHECK ERROR:",
            error.message
        );

        res.status(500).json({
            success: false,
            data: null,
            error: {
                code: "DATABASE_ERROR",
                message: "Database connection failed"
            },
            status: "DOWN",
            db: "DOWN"
        });
    }
};

app.get("/api/health", healthCheck);
app.get("/api/v1/health", healthCheck);

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
// API 404
// ==========================================

app.use("/api", (req, res) => {
    res.status(404).json({
        success: false,
        data: null,
        error: {
            code: "NOT_FOUND",
            message: "API endpoint not found"
        }
    });
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