const express = require("express");

const {
    addToCart,
    getCart,
    updateCartQuantity,
    removeFromCart
} = require("../controllers/cartController");

const {
    requireBuyerBody,
    requireBuyerParam
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
    "/add",
    requireBuyerBody("buyer_id"),
    addToCart
);

router.get(
    "/:buyer_id",
    requireBuyerParam("buyer_id"),
    getCart
);

router.put(
    "/update",
    requireBuyerBody("buyer_id"),
    updateCartQuantity
);

router.delete(
    "/remove",
    requireBuyerBody("buyer_id"),
    removeFromCart
);

module.exports = router;