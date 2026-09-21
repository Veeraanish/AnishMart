const express = require("express");

const {
    getDashboardStats,
    getAllUsers,
    getAllProducts,
    deleteProduct,
    getAllOrders,
    updateAdminOrderStatus,
    getOrderDetails
} = require("../controllers/adminController");

const router = express.Router();


// ==========================================
// ADMIN DASHBOARD
// ==========================================

router.get(
    "/stats",
    getDashboardStats
);


// ==========================================
// ADMIN USERS
// ==========================================

router.get(
    "/users",
    getAllUsers
);


// ==========================================
// ADMIN PRODUCTS
// ==========================================

router.get(
    "/products",
    getAllProducts
);

router.delete(
    "/products/:id",
    deleteProduct
);


// ==========================================
// ADMIN ORDERS
// ==========================================

// Get all orders
router.get(
    "/orders",
    getAllOrders
);


// Get single order details
router.get(
    "/orders/:id",
    getOrderDetails
);


// Update order status
router.put(
    "/orders/:id/status",
    updateAdminOrderStatus
);


module.exports = router;