const express = require("express");

const {
    registerUser,
    loginUser,
    resetPassword,
    updateProfile,
    changePassword
} = require("../controllers/userController");

const {
    getSavedAddress,
    saveAddress,
    deleteSavedAddress
} = require("../controllers/addressController");

const router = express.Router();


// ====================================
// AUTH
// ====================================

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/reset-password", resetPassword);


// ====================================
// PROFILE
// ====================================

router.put("/:id/profile", updateProfile);

router.put("/:id/change-password", changePassword);


// ====================================
// SAVED DELIVERY ADDRESS
// ====================================

router.get("/:id/address", getSavedAddress);

router.put("/:id/address", saveAddress);

router.delete("/:id/address", deleteSavedAddress);


module.exports = router;