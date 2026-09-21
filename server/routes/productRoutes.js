const express = require("express");

const {
    getAllProducts,
    addProduct,
    updateProduct,
    deleteProduct
} = require("../controllers/productController");

const router = express.Router();

console.log("PRODUCT ROUTES LOADED");

router.get("/", getAllProducts);

// Add product
router.post("/", addProduct);
router.post("/add", addProduct);

// Update product
router.put("/:id", updateProduct);

router.delete("/:id", deleteProduct);

module.exports = router;