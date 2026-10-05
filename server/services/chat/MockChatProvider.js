const faqAnswers = [
    {
        keywords: ["hello", "hi", "hey"],
        reply: "Hi! I am the AnishMart shopping assistant. I can help with products, cart, orders, payment, delivery, wishlist and reviews."
    },
    {
        keywords: ["product", "products", "item", "items"],
        reply: "You can browse products from the Products page. Use search, categories and sorting to find what you need."
    },
    {
        keywords: ["cart", "add to cart"],
        reply: "Open the Products page and click Add to Cart. You can update quantity or remove items from the Cart page."
    },
    {
        keywords: ["payment", "pay", "cod", "cash on delivery"],
        reply: "AnishMart currently supports Cash on Delivery for the academic demo. Real online payment is not enabled."
    },
    {
        keywords: ["order", "orders", "history", "track"],
        reply: "After placing an order, open the Orders page to view your order history and current order status."
    },
    {
        keywords: ["delivery", "address", "shipping"],
        reply: "During checkout, enter your delivery address. You can save an address and reuse it for future orders."
    },
    {
        keywords: ["wishlist", "save for later"],
        reply: "Use Wishlist to save a product for later. You can add the saved product to your cart when needed."
    },
    {
        keywords: ["review", "rating", "ratings"],
        reply: "Eligible buyers can submit a product review and star rating after completing an order."
    },
    {
        keywords: ["seller", "sell"],
        reply: "Seller accounts can add, edit and delete product listings from the Seller Dashboard."
    },
    {
        keywords: ["admin"],
        reply: "The Admin Dashboard is used to view users, moderate products and manage orders."
    }
];

class MockChatProvider {
    async getReply(userMessage) {
        const text = String(userMessage || "")
            .trim()
            .toLowerCase();

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
}

module.exports = MockChatProvider;