const express = require("express");

const {
    addToCart,
    getCart,
    updateCartQuantity,
    removeFromCart
} = require("../controllers/cartController");

const router = express.Router();

router.post("/add", addToCart);

router.get("/:buyer_id", getCart);

router.put("/update", updateCartQuantity);

router.delete("/remove", removeFromCart);

module.exports = router;