const express = require("express");

const {
    addToWishlist,
    getWishlist,
    removeFromWishlist
} = require("../controllers/wishlistcontroller");

const {
    requireBuyerBody,
    requireBuyerParam
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
    "/add",
    requireBuyerBody("buyer_id"),
    addToWishlist
);

router.get(
    "/:buyer_id",
    requireBuyerParam("buyer_id"),
    getWishlist
);

router.delete(
    "/remove",
    requireBuyerBody("buyer_id"),
    removeFromWishlist
);

module.exports = router;