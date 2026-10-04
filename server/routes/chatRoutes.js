const express = require("express");

const router = express.Router();

const faqAnswers = [
    {
        keywords: ["hello", "hi", "hey"],
        reply: "Hi! I am the AnishMart shopping assistant. I can help with products, cart, orders, payment, delivery and returns."
    },
    {
        keywords: ["product", "products", "item", "items"],
        reply: "You can browse all available products from the Products page. Use search, category filters and sorting to find what you need."
    },
    {
        keywords: ["cart", "add to cart"],
        reply: "To add an item to your cart, open the Products page and click Add to Cart. You can update quantity or remove items from the Cart page."
    },
    {
        keywords: ["payment", "cod", "cash on delivery"],
        reply: "AnishMart currently supports Cash on Delivery for the academic demo. Real online payment is not enabled."
    },
    {
        keywords: ["order", "orders", "history"],
        reply: "After placing an order, open the Orders page to view your order history and current order status."
    },
    {
        keywords: ["delivery", "address", "shipping"],
        reply: "During checkout, enter your delivery address. You can also save an address and reuse it for future orders."
    },
    {
        keywords: ["wishlist", "save for later"],
        reply: "Use the Wishlist option on a product to save it for later. You can move it to your cart whenever you are ready."
    },
    {
        keywords: ["review", "rating", "ratings"],
        reply: "You can submit a product review and star rating after completing an eligible order."
    },
    {
        keywords: ["seller", "sell"],
        reply: "Seller accounts can add, edit and delete product listings from the Seller Dashboard."
    },
    {
        keywords: ["admin"],
        reply: "The Admin Dashboard is used to manage users, products and orders."
    }
];

function getReply(message) {
    const text = String(message || "")
        .trim()
        .toLowerCase();

    if (!text) {
        return "Please type a question about AnishMart.";
    }

    if (text.length > 300) {
        return "Please keep your question under 300 characters.";
    }

    for (const item of faqAnswers) {
        if (
            item.keywords.some(
                keyword => text.includes(keyword)
            )
        ) {
            return item.reply;
        }
    }

    return "I can help with AnishMart products, cart, wishlist, orders, delivery, payment, reviews, seller features and admin features.";
}

router.post("/", (req, res) => {
    try {
        const message = req.body.message;

        const reply = getReply(message);

        res.json({
            success: true,
            reply: reply
        });

    } catch (error) {
        console.error(
            "CHAT ERROR:",
            error.message
        );

        res.status(500).json({
            success: false,
            reply: "Chat service is temporarily unavailable. Please try again later."
        });
    }
});

module.exports = router;