const express = require("express");

const {
    addReview,
    getProductReviews,
    deleteReview
} = require("../controllers/reviewController");

const {
    requireBuyerBody
} = require("../middleware/authMiddleware");

const router = express.Router();

// Buyer only: add/update own review
router.post(
    "/",
    requireBuyerBody("buyer_id"),
    addReview
);

// Public: read product reviews
router.get(
    "/product/:product_id",
    getProductReviews
);

// Buyer only: delete own review
router.delete(
    "/:id",
    requireBuyerBody("buyer_id"),
    deleteReview
);

module.exports = router;