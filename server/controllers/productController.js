const pool = require("../config/db");


// ==========================================
// GET ALL ACTIVE PRODUCTS
// ==========================================
const getAllProducts = async (req, res) => {

    try {

        const [products] = await pool.query(
            `SELECT *
             FROM products
             WHERE is_active = 1
             ORDER BY id DESC`
        );

        res.json({
            success: true,
            products: products
        });

    } catch (error) {

        console.error(
            "GET PRODUCTS ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to fetch products"
        });

    }

};


// ==========================================
// ADD PRODUCT
// ==========================================
const addProduct = async (req, res) => {

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
                message: "Name, price, category and stock are required"
            });

        }


        const productPrice = Number(price);
        const productStock = Number(stock);


        if (
            !Number.isFinite(productPrice) ||
            productPrice <= 0
        ) {

            return res.status(400).json({
                success: false,
                message: "Price must be greater than 0"
            });

        }


        if (
            !Number.isInteger(productStock) ||
            productStock < 0
        ) {

            return res.status(400).json({
                success: false,
                message: "Stock must be 0 or greater"
            });

        }


        const [result] = await pool.query(
            `INSERT INTO products
            (
                name,
                description,
                price,
                category,
                image_url,
                stock,
                is_active
            )
            VALUES (?, ?, ?, ?, ?, ?, 1)`,
            [
                name.trim(),
                description || "",
                productPrice,
                category.trim(),
                image_url || null,
                productStock
            ]
        );


        res.status(201).json({
            success: true,
            message: "Product added successfully",
            product_id: result.insertId
        });


    } catch (error) {

        console.error(
            "ADD PRODUCT ERROR:",
            error
        );


        res.status(500).json({
            success: false,
            message: "Failed to add product"
        });

    }

};


// ==========================================
// UPDATE PRODUCT
// ==========================================
const updateProduct = async (req, res) => {

    try {

        const {
            id
        } = req.params;


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
                message: "Name, price, category and stock are required"
            });

        }


        const productPrice = Number(price);
        const productStock = Number(stock);


        if (
            !Number.isFinite(productPrice) ||
            productPrice <= 0
        ) {

            return res.status(400).json({
                success: false,
                message: "Price must be greater than 0"
            });

        }


        if (
            !Number.isInteger(productStock) ||
            productStock < 0
        ) {

            return res.status(400).json({
                success: false,
                message: "Stock must be 0 or greater"
            });

        }


        const [result] = await pool.query(
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
                id
            ]
        );


        if (
            result.affectedRows === 0
        ) {

            return res.status(404).json({
                success: false,
                message: "Product not found"
            });

        }


        res.json({
            success: true,
            message: "Product updated successfully"
        });


    } catch (error) {

        console.error(
            "UPDATE PRODUCT ERROR:",
            error
        );


        res.status(500).json({
            success: false,
            message: "Failed to update product"
        });

    }

};


// ==========================================
// SOFT DELETE PRODUCT
// ==========================================
const deleteProduct = async (req, res) => {

    try {

        const {
            id
        } = req.params;


        const [result] = await pool.query(
            `UPDATE products
             SET is_active = 0
             WHERE id = ?
             AND is_active = 1`,
            [id]
        );


        if (
            result.affectedRows === 0
        ) {

            return res.status(404).json({
                success: false,
                message: "Product not found or already deleted"
            });

        }


        res.json({
            success: true,
            message: "Product deleted successfully"
        });


    } catch (error) {

        console.error(
            "DELETE PRODUCT ERROR:",
            error
        );


        res.status(500).json({
            success: false,
            message: "Failed to delete product"
        });

    }

};


// ==========================================
// EXPORT
// ==========================================
module.exports = {
    getAllProducts,
    addProduct,
    updateProduct,
    deleteProduct
};