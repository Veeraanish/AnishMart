const pool = require("../config/db");


// ==========================================
// BUYER: ADD PRODUCT TO WISHLIST
// ==========================================
const addToWishlist = async (req, res) => {

    try {

        const { buyer_id, product_id } = req.body;

        if (!buyer_id || !product_id) {
            return res.status(400).json({
                success: false,
                message: "Buyer ID and Product ID are required"
            });
        }


        // Check product exists and is active
        const [products] = await pool.query(
            `SELECT id
             FROM products
             WHERE id = ?
             AND is_active = 1`,
            [product_id]
        );


        if (products.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }


        // Check already in wishlist
        const [existing] = await pool.query(
            `SELECT id
             FROM wishlist
             WHERE buyer_id = ?
             AND product_id = ?`,
            [buyer_id, product_id]
        );


        if (existing.length > 0) {
            return res.status(200).json({
                success: true,
                message: "Product already in wishlist"
            });
        }


        // Add product
        await pool.query(
            `INSERT INTO wishlist
             (buyer_id, product_id)
             VALUES (?, ?)`,
            [buyer_id, product_id]
        );


        res.status(201).json({
            success: true,
            message: "Product added to wishlist successfully"
        });


    } catch (error) {

        console.error(
            "ADD WISHLIST ERROR:",
            error
        );


        res.status(500).json({
            success: false,
            message: "Failed to add product to wishlist"
        });

    }

};



// ==========================================
// BUYER: GET WISHLIST
// ==========================================
const getWishlist = async (req, res) => {

    try {

        const { buyer_id } = req.params;


        const [wishlist] = await pool.query(
            `SELECT
                w.id AS wishlist_id,
                w.buyer_id,
                w.product_id,
                w.created_at,
                p.name,
                p.description,
                p.price,
                p.category,
                p.image_url,
                p.stock
             FROM wishlist w
             JOIN products p
             ON w.product_id = p.id
             WHERE w.buyer_id = ?
             AND p.is_active = 1
             ORDER BY w.created_at DESC`,
            [buyer_id]
        );


        res.json({
            success: true,
            wishlist: wishlist
        });


    } catch (error) {

        console.error(
            "GET WISHLIST ERROR:",
            error
        );


        res.status(500).json({
            success: false,
            message: "Failed to fetch wishlist"
        });

    }

};



// ==========================================
// BUYER: REMOVE PRODUCT FROM WISHLIST
// ==========================================
const removeFromWishlist = async (req, res) => {

    try {

        const { buyer_id, product_id } = req.body;


        if (!buyer_id || !product_id) {
            return res.status(400).json({
                success: false,
                message: "Buyer ID and Product ID are required"
            });
        }


        const [result] = await pool.query(
            `DELETE FROM wishlist
             WHERE buyer_id = ?
             AND product_id = ?`,
            [buyer_id, product_id]
        );


        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Product not found in wishlist"
            });
        }


        res.json({
            success: true,
            message: "Product removed from wishlist successfully"
        });


    } catch (error) {

        console.error(
            "REMOVE WISHLIST ERROR:",
            error
        );


        res.status(500).json({
            success: false,
            message: "Failed to remove product from wishlist"
        });

    }

};



// ==========================================
// EXPORT
// ==========================================
module.exports = {
    addToWishlist,
    getWishlist,
    removeFromWishlist
};
