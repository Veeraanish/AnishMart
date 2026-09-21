const express = require("express");

const {
    addReview,
    getProductReviews,
    deleteReview
} = require("../controllers/reviewController");


const router = express.Router();


// ==========================================
// ADD / UPDATE REVIEW
// ==========================================
router.post("/", addReview);


// ==========================================
// GET REVIEWS OF ONE PRODUCT
// ==========================================
router.get(
    "/product/:product_id",
    getProductReviews
);


// ==========================================
// DELETE REVIEW
// ==========================================
router.delete(
    "/:id",
    deleteReview
);


module.exports = router;