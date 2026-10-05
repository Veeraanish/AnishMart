const express = require("express");

const {
    createChatProvider
} = require("../services/chat/providerFactory");

const router = express.Router();

const provider = createChatProvider();

const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const INPUT_LIMIT = 300;
const PROVIDER_TIMEOUT_MS = 5000;

const sessionState = new Map();

function getClientKey(req) {
    return (
        req.headers["x-forwarded-for"] ||
        req.ip ||
        req.socket.remoteAddress ||
        "anonymous"
    )
        .toString()
        .split(",")[0]
        .trim();
}

function getState(key) {
    const now = Date.now();

    let state = sessionState.get(key);

    if (
        !state ||
        now - state.windowStartedAt >= RATE_LIMIT_WINDOW_MS
    ) {
        state = {
            windowStartedAt: now,
            messageCount: 0,
            cache: new Map()
        };

        sessionState.set(
            key,
            state
        );
    }

    return state;
}

function normalizeMessage(message) {
    return String(message || "")
        .trim()
        .replace(/\s+/g, " ");
}

async function getReplyWithTimeout(message) {
    const providerCall =
        provider.getReply(message);

    const timeout =
        new Promise((_, reject) => {
            setTimeout(
                () => reject(
                    new Error("CHAT_PROVIDER_TIMEOUT")
                ),
                PROVIDER_TIMEOUT_MS
            );
        });

    return Promise.race([
        providerCall,
        timeout
    ]);
}

async function getReply(message) {
    return getReplyWithTimeout(message);
}

router.post("/", async (req, res) => {
    try {
        const message =
            normalizeMessage(
                req.body?.message
            );

        if (!message) {
            return res.status(400).json({
                success: false,
                data: null,
                error: {
                    code: "VALIDATION_ERROR",
                    message: "Please type a question about AnishMart."
                }
            });
        }

        if (message.length > INPUT_LIMIT) {
            return res.status(400).json({
                success: false,
                data: null,
                error: {
                    code: "MESSAGE_TOO_LONG",
                    message:
                        `Please keep your question under ${INPUT_LIMIT} characters.`
                }
            });
        }

        const clientKey =
            getClientKey(req);

        const state =
            getState(clientKey);

        if (
            state.messageCount >=
            RATE_LIMIT_MAX
        ) {
            return res.status(429).json({
                success: false,
                data: null,
                error: {
                    code: "RATE_LIMITED",
                    message:
                        "Please wait a moment before sending more chatbot messages."
                }
            });
        }

        state.messageCount++;

        const cacheKey =
            message.toLowerCase();

        if (
            state.cache.has(cacheKey)
        ) {
            return res.json({
                success: true,
                data: {
                    reply:
                        state.cache.get(cacheKey),
                    cached: true
                },
                error: null,

                // Legacy UI compatibility
                reply:
                    state.cache.get(cacheKey)
            });
        }

        let reply;

        try {
            reply =
                await getReply(
                    message
                );
        } catch (providerError) {
            console.error(
                "CHAT PROVIDER ERROR:",
                providerError.message
            );

            reply =
                "I am temporarily unable to process that request. You can still ask about AnishMart products, cart, COD, orders, wishlist or delivery.";
        }

        state.cache.set(
            cacheKey,
            reply
        );

        res.json({
            success: true,
            data: {
                reply,
                cached: false
            },
            error: null,

            // Legacy chatbot.js compatibility
            reply
        });

    } catch (error) {
        console.error(
            "CHAT ERROR:",
            error.message
        );

        res.status(500).json({
            success: false,
            data: null,
            error: {
                code: "CHAT_ERROR",
                message:
                    "Chat service is temporarily unavailable."
            },
            reply:
                "Chat service is temporarily unavailable. Please try again later."
        });
    }
});

module.exports = router;
module.exports.getReply = getReply;