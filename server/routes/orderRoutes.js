const express = require("express");

const {
    createOrder,
    getOrderHistory,
    getAllOrders,
    updateOrderStatus
} = require("../controllers/orderController");

const {
    requireRole,
    requireBuyerBody,
    requireBuyerParam
} = require("../middleware/authMiddleware");

const router = express.Router();

console.log("ORDER ROUTES LOADED");

router.post(
    "/create",
    requireBuyerBody("buyer_id"),
    createOrder
);

router.get(
    "/history/:buyer_id",
    requireBuyerParam("buyer_id"),
    getOrderHistory
);

router.get(
    "/",
    requireRole("seller", "admin"),
    getAllOrders
);

router.put(
    "/:id/status",
    requireRole("seller", "admin"),
    updateOrderStatus
);

module.exports = router;