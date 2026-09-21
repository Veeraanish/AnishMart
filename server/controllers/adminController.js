const pool = require("../config/db");


// ==========================================
// GET ADMIN DASHBOARD STATS
// ==========================================

const getDashboardStats = async (req, res) => {

    try {

        const [buyerResult] = await pool.query(`
            SELECT COUNT(*) AS total
            FROM users
            WHERE role = 'buyer'
        `);

        const [sellerResult] = await pool.query(`
            SELECT COUNT(*) AS total
            FROM users
            WHERE role = 'seller'
        `);

        const [productResult] = await pool.query(`
            SELECT COUNT(*) AS total
            FROM products
            WHERE is_active = 1
        `);

        const [orderResult] = await pool.query(`
            SELECT COUNT(*) AS total
            FROM orders
        `);

        res.json({
            success: true,
            stats: {
                buyers: buyerResult[0].total,
                sellers: sellerResult[0].total,
                products: productResult[0].total,
                orders: orderResult[0].total
            }
        });

    } catch (error) {

        console.error(
            "ADMIN STATS ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to load admin dashboard stats",
            error: error.message
        });
    }
};


// ==========================================
// GET ALL BUYERS AND SELLERS
// ==========================================

const getAllUsers = async (req, res) => {

    try {

        const [users] = await pool.query(`
            SELECT
                id,
                name,
                email,
                role,
                created_at
            FROM users
            WHERE role IN ('buyer', 'seller')
            ORDER BY id DESC
        `);

        res.json({
            success: true,
            users: users
        });

    } catch (error) {

        console.error(
            "ADMIN USERS ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to load users",
            error: error.message
        });
    }
};


// ==========================================
// GET ACTIVE PRODUCTS ONLY
// ==========================================

const getAllProducts = async (req, res) => {

    try {

        const [products] = await pool.query(`
            SELECT
                id,
                name,
                description,
                price,
                category,
                image_url,
                stock,
                created_at,
                is_active
            FROM products
            WHERE is_active = 1
            ORDER BY id DESC
        `);

        res.json({
            success: true,
            products: products
        });

    } catch (error) {

        console.error(
            "ADMIN PRODUCTS ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to load products",
            error: error.message
        });
    }
};


// ==========================================
// ADMIN REMOVE PRODUCT
// SOFT DELETE
// ==========================================

const deleteProduct = async (req, res) => {

    try {

        const productId = req.params.id;

        const [result] = await pool.query(
            `
            UPDATE products
            SET is_active = 0
            WHERE id = ?
            `,
            [productId]
        );

        if (result.affectedRows === 0) {

            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.json({
            success: true,
            message: "Product removed successfully"
        });

    } catch (error) {

        console.error(
            "ADMIN DELETE PRODUCT ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to remove product",
            error: error.message
        });
    }
};


// ==========================================
// GET ALL ORDERS
// ==========================================

const getAllOrders = async (req, res) => {

    try {

        const [orders] = await pool.query(`
            SELECT
                o.id,
                o.buyer_id,
                o.total_amount,
                o.payment_method,
                o.status,
                o.payment_status,
                o.created_at,
                o.customer_name,
                o.phone,
                o.address,
                o.city,
                o.state,
                o.pincode,
                u.name AS buyer_name,
                u.email AS buyer_email
            FROM orders o

            LEFT JOIN users u
                ON o.buyer_id = u.id

            ORDER BY o.id DESC
        `);

        res.json({
            success: true,
            orders: orders
        });

    } catch (error) {

        console.error(
            "ADMIN ORDERS ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to load orders",
            error: error.message
        });
    }
};


// ==========================================
// UPDATE ORDER STATUS
// ==========================================

const updateAdminOrderStatus = async (
    req,
    res
) => {

    try {

        const orderId = req.params.id;

        const { status } = req.body;

        const allowedStatuses = [
            "PLACED",
            "PROCESSING",
            "SHIPPED",
            "DELIVERED",
            "CANCELLED"
        ];

        if (!allowedStatuses.includes(status)) {

            return res.status(400).json({
                success: false,
                message: "Invalid order status"
            });
        }

        const [result] = await pool.query(
            `
            UPDATE orders
            SET status = ?
            WHERE id = ?
            `,
            [
                status,
                orderId
            ]
        );

        if (result.affectedRows === 0) {

            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        res.json({
            success: true,
            message: "Order status updated successfully"
        });

    } catch (error) {

        console.error(
            "ADMIN ORDER STATUS ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to update order status",
            error: error.message
        });
    }
};


// ==========================================
// GET SINGLE ORDER DETAILS
// ==========================================

const getOrderDetails = async (
    req,
    res
) => {

    try {

        const orderId = req.params.id;

        const [orders] = await pool.query(
            `
            SELECT
                o.id,
                o.buyer_id,
                o.total_amount,
                o.payment_method,
                o.payment_status,
                o.status,
                o.created_at,
                o.customer_name,
                o.phone,
                o.address,
                o.city,
                o.state,
                o.pincode,
                u.name AS buyer_name,
                u.email AS buyer_email
            FROM orders o

            LEFT JOIN users u
                ON o.buyer_id = u.id

            WHERE o.id = ?
            `,
            [orderId]
        );

        if (orders.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        const [items] = await pool.query(
            `
            SELECT
                oi.id,
                oi.order_id,
                oi.product_id,
                oi.quantity,
                oi.unit_price,

                p.name AS product_name,
                p.image_url,

                (
                    oi.quantity *
                    oi.unit_price
                ) AS item_total

            FROM order_items oi

            LEFT JOIN products p
                ON oi.product_id = p.id

            WHERE oi.order_id = ?

            ORDER BY oi.id ASC
            `,
            [orderId]
        );

        res.json({
            success: true,
            order: orders[0],
            items: items
        });

    } catch (error) {

        console.error(
            "ADMIN ORDER DETAILS ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to load order details",
            error: error.message
        });
    }
};


// ==========================================
// EXPORTS
// ==========================================

module.exports = {
    getDashboardStats,
    getAllUsers,
    getAllProducts,
    deleteProduct,
    getAllOrders,
    updateAdminOrderStatus,
    getOrderDetails
};
