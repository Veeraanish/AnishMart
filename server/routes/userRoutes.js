const express = require("express");

const {
    registerUser,
    loginUser,
    resetPassword,
    logoutUser,
    getSessionUser,
    updateProfile,
    changePassword
} = require("../controllers/userController");

const {
    getSavedAddress,
    saveAddress,
    deleteSavedAddress
} = require("../controllers/addressController");

const {
    requireAuth,
    requireRole,
    requireSelfParam
} = require("../middleware/authMiddleware");

const router = express.Router();

// PUBLIC AUTH
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

// Session status
router.get(
    "/session",
    requireAuth,
    getSessionUser
);

// Disabled insecure demo reset
router.post(
    "/reset-password",
    resetPassword
);

// PROFILE
router.put(
    "/:id/profile",
    requireAuth,
    requireSelfParam("id"),
    updateProfile
);

router.put(
    "/:id/change-password",
    requireAuth,
    requireSelfParam("id"),
    changePassword
);

// BUYER SAVED ADDRESS
router.get(
    "/:id/address",
    requireRole("buyer"),
    requireSelfParam("id"),
    getSavedAddress
);

router.put(
    "/:id/address",
    requireRole("buyer"),
    requireSelfParam("id"),
    saveAddress
);

router.delete(
    "/:id/address",
    requireRole("buyer"),
    requireSelfParam("id"),
    deleteSavedAddress
);

module.exports = router;