const test = require("node:test");
const assert = require("node:assert/strict");

const {
    requireAuth,
    requireRole,
    requireBuyerBody
} = require("../middleware/authMiddleware");

function mockResponse() {

    return {
        statusCode: 200,
        body: null,

        status(code) {
            this.statusCode = code;
            return this;
        },

        json(data) {
            this.body = data;
            return this;
        }
    };
}

test(
    "requireAuth rejects missing session",
    () => {

        const req = {};
        const res =
            mockResponse();

        let nextCalled =
            false;

        requireAuth(
            req,
            res,
            () => {
                nextCalled = true;
            }
        );

        assert.equal(
            res.statusCode,
            401
        );

        assert.equal(
            nextCalled,
            false
        );
    }
);

test(
    "requireRole rejects wrong role",
    () => {

        const req = {
            session: {
                user: {
                    id: 1,
                    role: "buyer"
                }
            }
        };

        const res =
            mockResponse();

        let nextCalled =
            false;

        requireRole("admin")(
            req,
            res,
            () => {
                nextCalled = true;
            }
        );

        assert.equal(
            res.statusCode,
            403
        );

        assert.equal(
            nextCalled,
            false
        );
    }
);

test(
    "requireRole accepts allowed role",
    () => {

        const req = {
            session: {
                user: {
                    id: 1,
                    role: "admin"
                }
            }
        };

        const res =
            mockResponse();

        let nextCalled =
            false;

        requireRole("admin")(
            req,
            res,
            () => {
                nextCalled = true;
            }
        );

        assert.equal(
            nextCalled,
            true
        );
    }
);

test(
    "buyer body must match logged in buyer",
    () => {

        const req = {
            session: {
                user: {
                    id: 5,
                    role: "buyer"
                }
            },

            body: {
                buyer_id: 5
            }
        };

        const res =
            mockResponse();

        let nextCalled =
            false;

        requireBuyerBody("buyer_id")(
            req,
            res,
            () => {
                nextCalled = true;
            }
        );

        assert.equal(
            nextCalled,
            true
        );
    }
);

test(
    "buyer cannot use another buyer id",
    () => {

        const req = {
            session: {
                user: {
                    id: 5,
                    role: "buyer"
                }
            },

            body: {
                buyer_id: 99
            }
        };

        const res =
            mockResponse();

        let nextCalled =
            false;

        requireBuyerBody("buyer_id")(
            req,
            res,
            () => {
                nextCalled = true;
            }
        );

        assert.equal(
            res.statusCode,
            403
        );

        assert.equal(
            nextCalled,
            false
        );
    }
);