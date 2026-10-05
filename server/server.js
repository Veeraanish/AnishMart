const express = require("express");
const cors = require("cors");
const path = require("path");
const crypto = require("crypto");
const session = require("express-session");

const MySQLStoreFactory =
    require("express-mysql-session");

require("dotenv").config();

const pool =
    require("./config/db");

const userRoutes =
    require("./routes/userRoutes");

const productRoutes =
    require("./routes/productRoutes");

const cartRoutes =
    require("./routes/cartRoutes");

const orderRoutes =
    require("./routes/orderRoutes");

const reviewRoutes =
    require("./routes/reviewRoutes");

const wishlistRoutes =
    require("./routes/wishlistRoutes");

const adminRoutes =
    require("./routes/adminRoutes");

const chatRoutes =
    require("./routes/chatRoutes");

const app = express();

const PORT =
    process.env.PORT || 5000;

if (!process.env.SESSION_SECRET) {
    throw new Error(
        "SESSION_SECRET environment variable is required"
    );
}

app.set(
    "trust proxy",
    1
);

app.use(cors());
app.use(express.json());

const MySQLStore =
    MySQLStoreFactory(session);

const sessionStore =
    new MySQLStore({
        host:
            process.env.MYSQLHOST ||
            process.env.DB_HOST ||
            "localhost",

        port:
            Number(
                process.env.MYSQLPORT ||
                process.env.DB_PORT ||
                3306
            ),

        user:
            process.env.MYSQLUSER ||
            process.env.DB_USER ||
            "root",

        password:
            process.env.MYSQLPASSWORD ||
            process.env.DB_PASSWORD ||
            "",

        database:
            process.env.MYSQLDATABASE ||
            process.env.DB_NAME ||
            "anishmart",

        createDatabaseTable: true
    });

app.use(
    session({
        name:
            "anishmart.sid",

        secret:
            process.env.SESSION_SECRET,

        store:
            sessionStore,

        resave:
            false,

        saveUninitialized:
            false,

        rolling:
            true,

        cookie: {
            httpOnly: true,
            secure: "auto",
            sameSite: "lax",
            maxAge:
                1000 * 60 * 60 * 2
        }
    })
);

// Request ID + structured logging
app.use(
    (req, res, next) => {

        const requestId =
            req.get("X-Request-ID") ||
            crypto.randomUUID();

        req.requestId =
            requestId;

        res.setHeader(
            "X-Request-ID",
            requestId
        );

        const startedAt =
            Date.now();

        res.on(
            "finish",
            () => {

                console.log(
                    JSON.stringify({
                        type:
                            "http_request",

                        requestId,

                        method:
                            req.method,

                        path:
                            req.originalUrl,

                        status:
                            res.statusCode,

                        durationMs:
                            Date.now() -
                            startedAt
                    })
                );
            }
        );

        next();
    }
);

// Static frontend
app.use(
    express.static(
        path.join(
            __dirname,
            "../client"
        )
    )
);

// Legacy APIs
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/chat", chatRoutes);

// Versioned APIs
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/reviews", reviewRoutes);
app.use("/api/v1/wishlist", wishlistRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/chat", chatRoutes);

const healthCheck =
async (req, res) => {

    try {

        await pool.query(
            "SELECT 1"
        );

        return res.json({
            success: true,

            data: {
                status: "UP",
                db: "UP",
                application:
                    "AnishMart"
            },

            error: null,

            status: "UP",
            db: "UP"
        });

    } catch (error) {

        console.error(
            JSON.stringify({
                type:
                    "health_error",

                requestId:
                    req.requestId,

                message:
                    "Database connectivity failed"
            })
        );

        return res
            .status(500)
            .json({
                success: false,
                data: null,

                error: {
                    code:
                        "DATABASE_ERROR",
                    message:
                        "Database connection failed"
                },

                status: "DOWN",
                db: "DOWN"
            });
    }
};

app.get(
    "/api/health",
    healthCheck
);

app.get(
    "/api/v1/health",
    healthCheck
);

app.get(
    "/",
    (req, res) => {

        res.sendFile(
            path.join(
                __dirname,
                "../client/index.html"
            )
        );
    }
);

// API 404
app.use(
    "/api",
    (req, res) => {

        return res
            .status(404)
            .json({
                success: false,
                data: null,

                error: {
                    code:
                        "NOT_FOUND",
                    message:
                        "API endpoint not found"
                }
            });
    }
);

// Safe global error handler
app.use(
    (error, req, res, next) => {

        console.error(
            JSON.stringify({
                type:
                    "unhandled_error",

                requestId:
                    req.requestId,

                message:
                    error.message
            })
        );

        if (res.headersSent) {
            return next(error);
        }

        return res
            .status(500)
            .json({
                success: false,
                data: null,

                error: {
                    code:
                        "INTERNAL_ERROR",
                    message:
                        "Internal server error"
                }
            });
    }
);

app.listen(
    PORT,
    () => {

        console.log(
            `AnishMart full application running on http://localhost:${PORT}`
        );
    }
);

process.stdin.resume();