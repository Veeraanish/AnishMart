const pool = require("../config/db");


// ==========================================
// ADD OR UPDATE REVIEW
// ==========================================
const addReview = async (req, res) => {

    try {

        const {
            buyer_id,
            product_id,
            rating,
            comment
        } = req.body;


        // VALIDATION
        if (!buyer_id || !product_id || !rating) {

            return res.status(400).json({
                success: false,
                message: "Buyer, product and rating are required"
            });

        }


        const ratingNumber = Number(rating);


        if (
            ratingNumber < 1 ||
            ratingNumber > 5
        ) {

            return res.status(400).json({
                success: false,
                message: "Rating must be between 1 and 5"
            });

        }


        // CHECK PRODUCT
        const [products] = await pool.query(
            "SELECT id FROM products WHERE id = ?",
            [product_id]
        );


        if (products.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Product not found"
            });

        }


        // CHECK IF BUYER ALREADY REVIEWED
        const [existingReview] = await pool.query(
            `SELECT id
             FROM reviews
             WHERE buyer_id = ?
             AND product_id = ?`,
            [
                buyer_id,
                product_id
            ]
        );


        // UPDATE EXISTING REVIEW
        if (existingReview.length > 0) {

            await pool.query(
                `UPDATE reviews
                 SET rating = ?,
                     comment = ?
                 WHERE buyer_id = ?
                 AND product_id = ?`,
                [
                    ratingNumber,
                    comment || "",
                    buyer_id,
                    product_id
                ]
            );


            return res.json({
                success: true,
                message: "Review updated successfully"
            });

        }


        // ADD NEW REVIEW
        await pool.query(
            `INSERT INTO reviews
            (
                buyer_id,
                product_id,
                rating,
                comment
            )
            VALUES (?, ?, ?, ?)`,
            [
                buyer_id,
                product_id,
                ratingNumber,
                comment || ""
            ]
        );


        res.status(201).json({
            success: true,
            message: "Review added successfully"
        });


    } catch (error) {

        console.error(
            "ADD REVIEW ERROR:",
            error
        );


        res.status(500).json({
            success: false,
            message: "Failed to add review"
        });

    }

};



// ==========================================
// GET REVIEWS FOR ONE PRODUCT
// ==========================================
const getProductReviews = async (req, res) => {

    try {

        const {
            product_id
        } = req.params;


        const [reviews] = await pool.query(
            `SELECT
                r.id,
                r.buyer_id,
                r.product_id,
                r.rating,
                r.comment,
                r.created_at,
                u.name AS buyer_name
             FROM reviews r
             JOIN users u
             ON r.buyer_id = u.id
             WHERE r.product_id = ?
             ORDER BY r.created_at DESC`,
            [product_id]
        );


        const [ratingResult] = await pool.query(
            `SELECT
                ROUND(AVG(rating), 1) AS average_rating,
                COUNT(*) AS total_reviews
             FROM reviews
             WHERE product_id = ?`,
            [product_id]
        );


        res.json({

            success: true,

            average_rating:
                ratingResult[0].average_rating || 0,

            total_reviews:
                ratingResult[0].total_reviews || 0,

            reviews: reviews

        });


    } catch (error) {

        console.error(
            "GET REVIEWS ERROR:",
            error
        );


        res.status(500).json({
            success: false,
            message: "Failed to fetch reviews"
        });

    }

};



// ==========================================
// DELETE REVIEW
// ==========================================
const deleteReview = async (req, res) => {

    try {

        const {
            id
        } = req.params;


        const {
            buyer_id
        } = req.body;


        if (!buyer_id) {

            return res.status(400).json({
                success: false,
                message: "Buyer ID is required"
            });

        }


        const [result] = await pool.query(
            `DELETE FROM reviews
             WHERE id = ?
             AND buyer_id = ?`,
            [
                id,
                buyer_id
            ]
        );


        if (result.affectedRows === 0) {

            return res.status(404).json({
                success: false,
                message: "Review not found"
            });

        }


        res.json({
            success: true,
            message: "Review deleted successfully"
        });


    } catch (error) {

        console.error(
            "DELETE REVIEW ERROR:",
            error
        );


        res.status(500).json({
            success: false,
            message: "Failed to delete review"
        });

    }

};



// ==========================================
// EXPORT
// ==========================================
module.exports = {
    addReview,
    getProductReviews,
    deleteReview
};