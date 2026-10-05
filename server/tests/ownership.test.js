const test =
    require("node:test");

const assert =
    require("node:assert/strict");

const {
    canManageProduct
} = require("../utils/ownership");


test(
    "seller can manage own product",
    () => {

        assert.equal(
            canManageProduct(
                {
                    id: 5,
                    role: "seller"
                },
                5
            ),
            true
        );
    }
);


test(
    "seller cannot manage another seller product",
    () => {

        assert.equal(
            canManageProduct(
                {
                    id: 5,
                    role: "seller"
                },
                8
            ),
            false
        );
    }
);


test(
    "admin can manage any product",
    () => {

        assert.equal(
            canManageProduct(
                {
                    id: 1,
                    role: "admin"
                },
                8
            ),
            true
        );
    }
);


test(
    "buyer cannot manage seller product",
    () => {

        assert.equal(
            canManageProduct(
                {
                    id: 10,
                    role: "buyer"
                },
                10
            ),
            false
        );
    }
);