const test = require("node:test");
const assert = require("node:assert/strict");

const {
    getReply,
    validateMessage
} = require("../routes/chatRoutes");

test("greets user", async () => {
    const reply =
        await getReply("hello");

    assert.match(
        reply,
        /shopping assistant/i
    );
});

test("answers cart question", async () => {
    const reply =
        await getReply(
            "How do I add to cart?"
        );

    assert.match(
        reply,
        /cart/i
    );
});

test("answers payment question", async () => {
    const reply =
        await getReply(
            "How can I pay?"
        );

    assert.match(
        reply,
        /Cash on Delivery/i
    );
});

test("answers order question", async () => {
    const reply =
        await getReply(
            "Where are my orders?"
        );

    assert.match(
        reply,
        /Orders page/i
    );
});

test("rejects empty message", () => {
    const result =
        validateMessage("");

    assert.equal(
        result.valid,
        false
    );

    assert.equal(
        result.code,
        "VALIDATION_ERROR"
    );

    assert.match(
        result.message,
        /Please type/i
    );
});

test("limits long input", () => {
    const result =
        validateMessage(
            "a".repeat(301)
        );

    assert.equal(
        result.valid,
        false
    );

    assert.equal(
        result.code,
        "MESSAGE_TOO_LONG"
    );

    assert.match(
        result.message,
        /300 characters/i
    );
});