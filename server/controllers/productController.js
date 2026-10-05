const pool = require("../config/db");

const {
    canManageProduct
} = require("../utils/ownership");


// ==========================================
// PUBLIC: GET ALL ACTIVE PRODUCTS
// ==========================================
const getAllProducts = async (
    req,
    res
) => {

    try {

        const [products] =
            await pool.query(
                `SELECT
                    id,
                    seller_id,
                    name,
                    description,
                    price,
                    category,
                    image_url,
                    stock,
                    created_at,
                    is_active
                 FROM products
                 WHERE is_active = 1
                 ORDER BY id DESC`
            );

        return res.json({
            success: true,
            products
        });

    } catch (error) {

        console.error(
            "GET PRODUCTS ERROR:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to fetch products"
        });
    }
};


// ==========================================
// SELLER: OWN PRODUCTS ONLY
// ==========================================
const getSellerProducts = async (
    req,
    res
) => {

    try {

        const sellerId =
            Number(req.user.id);

        const [products] =
            await pool.query(
                `SELECT
                    id,
                    seller_id,
                    name,
                    description,
                    price,
                    category,
                    image_url,
                    stock,
                    created_at,
                    is_active
                 FROM products
                 WHERE seller_id = ?
                 AND is_active = 1
                 ORDER BY id DESC`,
                [sellerId]
            );

        return res.json({
            success: true,
            products
        });

    } catch (error) {

        console.error(
            "GET SELLER PRODUCTS ERROR:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to fetch seller products"
        });
    }
};


// ==========================================
// ADD PRODUCT
// ==========================================
const addProduct = async (
    req,
    res
) => {

    try {

        const {
            name,
            description,
            price,
            category,
            image_url,
            stock
        } = req.body;

        if (
            !name ||
            !category ||
            price === undefined ||
            stock === undefined
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Name, price, category and stock are required"
            });
        }

        const productPrice =
            Number(price);

        const productStock =
            Number(stock);

        if (
            !Number.isFinite(productPrice) ||
            productPrice <= 0
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Price must be greater than 0"
            });
        }

        if (
            !Number.isInteger(productStock) ||
            productStock < 0
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Stock must be 0 or greater"
            });
        }

        const sellerId =
            req.user.role === "seller"
                ? Number(req.user.id)
                : null;

        const [result] =
            await pool.query(
                `INSERT INTO products
                (
                    seller_id,
                    name,
                    description,
                    price,
                    category,
                    image_url,
                    stock,
                    is_active
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, 1)`,
                [
                    sellerId,
                    name.trim(),
                    description || "",
                    productPrice,
                    category.trim(),
                    image_url || null,
                    productStock
                ]
            );

        return res.status(201).json({
            success: true,
            message:
                "Product added successfully",
            product_id:
                result.insertId
        });

    } catch (error) {

        console.error(
            "ADD PRODUCT ERROR:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to add product"
        });
    }
};


// ==========================================
// UPDATE PRODUCT
// ==========================================
const updateProduct = async (
    req,
    res
) => {

    try {

        const productId =
            Number(req.params.id);

        const {
            name,
            description,
            price,
            category,
            image_url,
            stock
        } = req.body;

        const [existing] =
            await pool.query(
                `SELECT
                    id,
                    seller_id
                 FROM products
                 WHERE id = ?
                 AND is_active = 1`,
                [productId]
            );

        if (existing.length === 0) {

            return res.status(404).json({
                success: false,
                message:
                    "Product not found"
            });
        }

        if (
            !canManageProduct(
                req.user,
                existing[0].seller_id
            )
        ) {

            return res.status(403).json({
                success: false,
                message:
                    "You can manage only your own products"
            });
        }

        if (
            !name ||
            !category ||
            price === undefined ||
            stock === undefined
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Name, price, category and stock are required"
            });
        }

        const productPrice =
            Number(price);

        const productStock =
            Number(stock);

        if (
            !Number.isFinite(productPrice) ||
            productPrice <= 0
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Price must be greater than 0"
            });
        }

        if (
            !Number.isInteger(productStock) ||
            productStock < 0
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Stock must be 0 or greater"
            });
        }

        await pool.query(
            `UPDATE products
             SET
                name = ?,
                description = ?,
                price = ?,
                category = ?,
                image_url = ?,
                stock = ?
             WHERE id = ?
             AND is_active = 1`,
            [
                name.trim(),
                description || "",
                productPrice,
                category.trim(),
                image_url || null,
                productStock,
                productId
            ]
        );

        return res.json({
            success: true,
            message:
                "Product updated successfully"
        });

    } catch (error) {

        console.error(
            "UPDATE PRODUCT ERROR:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to update product"
        });
    }
};


// ==========================================
// DELETE PRODUCT
// ==========================================
const deleteProduct = async (
    req,
    res
) => {

    try {

        const productId =
            Number(req.params.id);

        const [existing] =
            await pool.query(
                `SELECT
                    id,
                    seller_id
                 FROM products
                 WHERE id = ?
                 AND is_active = 1`,
                [productId]
            );

        if (existing.length === 0) {

            return res.status(404).json({
                success: false,
                message:
                    "Product not found or already deleted"
            });
        }

        if (
            !canManageProduct(
                req.user,
                existing[0].seller_id
            )
        ) {

            return res.status(403).json({
                success: false,
                message:
                    "You can delete only your own products"
            });
        }

        await pool.query(
            `UPDATE products
             SET is_active = 0
             WHERE id = ?`,
            [productId]
        );

        return res.json({
            success: true,
            message:
                "Product deleted successfully"
        });

    } catch (error) {

        console.error(
            "DELETE PRODUCT ERROR:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to delete product"
        });
    }
};


module.exports = {
    getAllProducts,
    getSellerProducts,
    addProduct,
    updateProduct,
    deleteProduct
};