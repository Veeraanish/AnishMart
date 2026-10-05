function unauthenticated(res) {
    return res.status(401).json({
        success: false,
        data: null,
        error: {
            code: "UNAUTHENTICATED",
            message: "Login required"
        },
        message: "Login required"
    });
}

function forbidden(res) {
    return res.status(403).json({
        success: false,
        data: null,
        error: {
            code: "FORBIDDEN",
            message: "You do not have permission to perform this action"
        },
        message: "You do not have permission to perform this action"
    });
}

function requireAuth(req, res, next) {
    if (
        !req.session ||
        !req.session.user
    ) {
        return unauthenticated(res);
    }

    req.user = req.session.user;
    next();
}

function requireRole(...allowedRoles) {
    return (req, res, next) => {

        if (
            !req.session ||
            !req.session.user
        ) {
            return unauthenticated(res);
        }

        if (
            !allowedRoles.includes(
                req.session.user.role
            )
        ) {
            return forbidden(res);
        }

        req.user = req.session.user;
        next();
    };
}

function requireSelfParam(paramName = "id") {
    return (req, res, next) => {

        if (
            !req.session ||
            !req.session.user
        ) {
            return unauthenticated(res);
        }

        if (
            req.session.user.role === "admin"
        ) {
            req.user = req.session.user;
            return next();
        }

        const requestedId =
            Number(req.params[paramName]);

        const sessionId =
            Number(req.session.user.id);

        if (
            !Number.isInteger(requestedId) ||
            requestedId !== sessionId
        ) {
            return forbidden(res);
        }

        req.user = req.session.user;
        next();
    };
}

function requireBuyerBody(field = "buyer_id") {
    return (req, res, next) => {

        if (
            !req.session ||
            !req.session.user
        ) {
            return unauthenticated(res);
        }

        if (
            req.session.user.role !== "buyer"
        ) {
            return forbidden(res);
        }

        const requestedId =
            Number(req.body?.[field]);

        const sessionId =
            Number(req.session.user.id);

        if (
            !Number.isInteger(requestedId) ||
            requestedId !== sessionId
        ) {
            return forbidden(res);
        }

        req.user = req.session.user;
        next();
    };
}

function requireBuyerParam(field = "buyer_id") {
    return (req, res, next) => {

        if (
            !req.session ||
            !req.session.user
        ) {
            return unauthenticated(res);
        }

        if (
            req.session.user.role !== "buyer"
        ) {
            return forbidden(res);
        }

        const requestedId =
            Number(req.params[field]);

        const sessionId =
            Number(req.session.user.id);

        if (
            !Number.isInteger(requestedId) ||
            requestedId !== sessionId
        ) {
            return forbidden(res);
        }

        req.user = req.session.user;
        next();
    };
}

module.exports = {
    requireAuth,
    requireRole,
    requireSelfParam,
    requireBuyerBody,
    requireBuyerParam
};