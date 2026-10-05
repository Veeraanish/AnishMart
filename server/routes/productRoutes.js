const express = require("express");

const {
    getAllProducts,
    addProduct,
    updateProduct,
    deleteProduct
} = require("../controllers/productController");

const {
    requireRole
} = require("../middleware/authMiddleware");

const router = express.Router();

console.log("PRODUCT ROUTES LOADED");

router.get("/", getAllProducts);

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