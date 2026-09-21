const pool = require("../config/db");


// ADD TO CART
const addToCart = async (req, res) => {
    try {
        const { buyer_id, product_id, quantity } = req.body;

        if (!buyer_id || !product_id || !quantity || quantity <= 0) {
            return res.status(400).json({
                success: false,
                message: "Valid buyer ID, product ID and quantity are required"
            });
        }

        await pool.query(
            `INSERT INTO cart_items (buyer_id, product_id, quantity)
             VALUES (?, ?, ?)
             ON DUPLICATE KEY UPDATE quantity = quantity + ?`,
            [buyer_id, product_id, quantity, quantity]
        );

        res.status(201).json({
            success: true,
            message: "Product added to cart"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to add product to cart"
        });
    }
};


// GET CART
const getCart = async (req, res) => {
    try {
        const { buyer_id } = req.params;

        const [cart] = await pool.query(
            `SELECT 
                cart_items.id,
                cart_items.buyer_id,
                cart_items.product_id,
                cart_items.quantity,
                products.name,
                products.price,
                products.category,
                products.stock,
                (cart_items.quantity * products.price) AS total
             FROM cart_items
             JOIN products
             ON cart_items.product_id = products.id
             WHERE cart_items.buyer_id = ?`,
            [buyer_id]
        );

        res.json({
            success: true,
            cart: cart
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch cart"
        });
    }
};


// UPDATE QUANTITY
const updateCartQuantity = async (req, res) => {
    try {
        const { buyer_id, product_id, quantity } = req.body;

        if (!buyer_id || !product_id || !quantity || quantity <= 0) {
            return res.status(400).json({
                success: false,
                message: "Valid buyer ID, product ID and quantity are required"
            });
        }

        const [product] = await pool.query(
            "SELECT stock FROM products WHERE id = ?",
            [product_id]
        );

        if (product.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        if (quantity > product[0].stock) {
            return res.status(400).json({
                success: false,
                message: `Only ${product[0].stock} items available`
            });
        }

        await pool.query(
            `UPDATE cart_items
             SET quantity = ?
             WHERE buyer_id = ? AND product_id = ?`,
            [quantity, buyer_id, product_id]
        );

        res.json({
            success: true,
            message: "Cart quantity updated"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to update cart"
        });
    }
};


// REMOVE FROM CART
const removeFromCart = async (req, res) => {
    try {
        const { buyer_id, product_id } = req.body;

        if (!buyer_id || !product_id) {
            return res.status(400).json({
                success: false,
                message: "Buyer ID and product ID are required"
            });
        }

        await pool.query(
            `DELETE FROM cart_items
             WHERE buyer_id = ? AND product_id = ?`,
            [buyer_id, product_id]
        );

        res.json({
            success: true,
            message: "Product removed from cart"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to remove product from cart"
        });
    }
};


module.exports = {
    addToCart,
    getCart,
    updateCartQuantity,
    removeFromCart
};