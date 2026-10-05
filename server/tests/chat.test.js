const test = require("node:test");
const assert = require("node:assert/strict");

const { getReply } = require("../routes/chatRoutes");

test("greets user", () => {
    assert.match(
        getReply("hello"),
        /shopping assistant/i
    );
});

test("answers cart question", () => {
    assert.match(
        getReply("How do I add to cart?"),
        /cart/i
    );
});

test("answers payment question", () => {
    assert.match(
        getReply("What payment is available?"),
        /Cash on Delivery/i
    );
});

test("answers order question", () => {
    assert.match(
        getReply("Where are my orders?"),
        /Orders page/i
    );
});

test("rejects empty message", () => {
    assert.match(
        getReply(""),
        /Please type/i
    );
});

test("limits long input", () => {
    assert.match(
        getReply("a".repeat(301)),
        /300 characters/i
    );
});