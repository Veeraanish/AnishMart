const express = require("express");

const {
    getAllProducts,
    getSellerProducts,
    addProduct,
    updateProduct,
    deleteProduct
} = require("../controllers/productController");

const {
    requireRole
} = require("../middleware/authMiddleware");

const router = express.Router();

console.log("PRODUCT ROUTES LOADED");

// Seller's own products
router.get(
    "/mine",
    requireRole("seller"),
    getSellerProducts
);

// Public catalogue
router.get(
    "/",
    getAllProducts
);

// Seller/admin create
router.post(
    "/",
    requireRole("seller", "admin"),
    addProduct
);

router.post(
    "/add",
    requireRole("seller", "admin"),
    addProduct
);

// Seller own product / Admin any product
router.put(
    "/:id",
    requireRole("seller", "admin"),
    updateProduct
);

router.delete(
    "/:id",
    requireRole("seller", "admin"),
    deleteProduct
);

module.exports = router;