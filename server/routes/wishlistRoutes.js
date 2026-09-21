const express = require("express");

const {
    addToWishlist,
    getWishlist,
    removeFromWishlist
} = require("../controllers/wishlistcontroller");

const router = express.Router();


// Add product to wishlist
router.post("/add", addToWishlist);


// Get buyer wishlist
router.get("/:buyer_id", getWishlist);


// Remove product from wishlist
router.delete("/remove", removeFromWishlist);


module.exports = router;
