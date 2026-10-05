const MockChatProvider =
    require("./MockChatProvider");

function createChatProvider() {
    const provider =
        String(
            process.env.AI_CHATBOT_PROVIDER || "mock"
        ).toLowerCase();

    switch (provider) {
        case "mock":
            return new MockChatProvider();

        default:
            console.warn(
                `Unknown chatbot provider "${provider}". Falling back to mock.`
            );

            return new MockChatProvider();
    }
}

module.exports = {
    createChatProvider
};