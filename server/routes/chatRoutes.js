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

function normalizeMessage(message) {
    return String(message || "")
        .trim()
        .replace(/\s+/g, " ");
}

function validateMessage(rawMessage) {
    const message = normalizeMessage(rawMessage);

    if (!message) {
        return {
            valid: false,
            code: "VALIDATION_ERROR",
            message:
                "Please type a question about AnishMart."
        };
    }

    if (message.length > INPUT_LIMIT) {
        return {
            valid: false,
            code: "MESSAGE_TOO_LONG",
            message:
                `Please keep your question under ${INPUT_LIMIT} characters.`
        };
    }

    return {
        valid: true,
        message
    };
}

function getClientKey(req) {
    const forwarded =
        req.headers["x-forwarded-for"];

    if (forwarded) {
        return forwarded
            .toString()
            .split(",")[0]
            .trim();
    }

    return (
        req.ip ||
        req.socket?.remoteAddress ||
        "anonymous"
    );
}

function getState(key) {
    const now = Date.now();

    let state = sessionState.get(key);

    if (
        !state ||
        now - state.windowStartedAt >=
            RATE_LIMIT_WINDOW_MS
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

async function getReplyWithTimeout(message) {
    let timeoutId;

    try {
        const timeoutPromise =
            new Promise((_, reject) => {
                timeoutId = setTimeout(
                    () => {
                        reject(
                            new Error(
                                "CHAT_PROVIDER_TIMEOUT"
                            )
                        );
                    },
                    PROVIDER_TIMEOUT_MS
                );
            });

        return await Promise.race([
            provider.getReply(message),
            timeoutPromise
        ]);

    } finally {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
    }
}

async function getReply(message) {
    return getReplyWithTimeout(message);
}

router.post("/", async (req, res) => {
    try {
        const validation =
            validateMessage(
                req.body?.message
            );

        if (!validation.valid) {
            return res.status(400).json({
                success: false,
                data: null,
                error: {
                    code:
                        validation.code,
                    message:
                        validation.message
                }
            });
        }

        const message =
            validation.message;

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
            const cachedReply =
                state.cache.get(cacheKey);

            return res.json({
                success: true,
                data: {
                    reply: cachedReply,
                    cached: true
                },
                error: null,

                // Legacy frontend support
                reply: cachedReply
            });
        }

        let reply;

        try {
            reply =
                await getReply(message);

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

        return res.json({
            success: true,
            data: {
                reply,
                cached: false
            },
            error: null,

            // Legacy frontend support
            reply
        });

    } catch (error) {
        console.error(
            "CHAT ERROR:",
            error.message
        );

        return res.status(500).json({
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
module.exports.validateMessage = validateMessage;