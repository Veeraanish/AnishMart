const express = require("express");

const {
    createOrder,
    getOrderHistory,
    getAllOrders,
    updateOrderStatus
} = require("../controllers/orderController");

const router = express.Router();

console.log("ORDER ROUTES LOADED");

// Buyer: Create order
router.post("/create", createOrder);

// Buyer: Order history
router.get("/history/:buyer_id", getOrderHistory);

// Seller: Get all customer orders
router.get("/", getAllOrders);

// Seller: Update order status
router.put("/:id/status", updateOrderStatus);

module.exports = router;