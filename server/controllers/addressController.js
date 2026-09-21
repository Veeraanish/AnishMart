const pool = require("../config/db");

// ====================================
// GET SAVED DELIVERY ADDRESS
// ====================================

const getSavedAddress = async (req, res) => {
    try {
        const buyerId = Number(req.params.id);

        if (!Number.isInteger(buyerId) || buyerId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid buyer ID"
            });
        }

        const [users] = await pool.query(
            "SELECT id, role FROM users WHERE id = ?",
            [buyerId]
        );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (users[0].role !== "buyer") {
            return res.status(403).json({
                success: false,
                message: "Buyer access only"
            });
        }

        const [addresses] = await pool.query(
            `SELECT
                id,
                buyer_id,
                customer_name,
                phone,
                address,
                city,
                state,
                pincode,
                created_at,
                updated_at
             FROM saved_addresses
             WHERE buyer_id = ?`,
            [buyerId]
        );

        if (addresses.length === 0) {
            return res.json({
                success: true,
                hasAddress: false,
                address: null
            });
        }

        res.json({
            success: true,
            hasAddress: true,
            address: addresses[0]
        });

    } catch (error) {
        console.error("GET SAVED ADDRESS ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to load saved address"
        });
    }
};


// ====================================
// SAVE / UPDATE DELIVERY ADDRESS
// ====================================

const saveAddress = async (req, res) => {
    try {
        const buyerId = Number(req.params.id);

        const {
            customer_name,
            phone,
            address,
            city,
            state,
            pincode
        } = req.body;

        if (!Number.isInteger(buyerId) || buyerId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid buyer ID"
            });
        }

        if (
            !customer_name ||
            !phone ||
            !address ||
            !city ||
            !state ||
            !pincode
        ) {
            return res.status(400).json({
                success: false,
                message: "All delivery details are required"
            });
        }

        const cleanName = customer_name.trim();
        const cleanPhone = phone.trim();
        const cleanAddress = address.trim();
        const cleanCity = city.trim();
        const cleanState = state.trim();
        const cleanPincode = pincode.trim();

        if (!/^[0-9]{10}$/.test(cleanPhone)) {
            return res.status(400).json({
                success: false,
                message: "Phone number must contain 10 digits"
            });
        }

        if (!/^[0-9]{6}$/.test(cleanPincode)) {
            return res.status(400).json({
                success: false,
                message: "Pincode must contain 6 digits"
            });
        }

        if (
            cleanName.length > 100 ||
            cleanAddress.length > 255 ||
            cleanCity.length > 100 ||
            cleanState.length > 100
        ) {
            return res.status(400).json({
                success: false,
                message: "Delivery details are too long"
            });
        }

        const [users] = await pool.query(
            "SELECT id, role FROM users WHERE id = ?",
            [buyerId]
        );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (users[0].role !== "buyer") {
            return res.status(403).json({
                success: false,
                message: "Buyer access only"
            });
        }

        await pool.query(
            `INSERT INTO saved_addresses
            (
                buyer_id,
                customer_name,
                phone,
                address,
                city,
                state,
                pincode
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)

            ON DUPLICATE KEY UPDATE

                customer_name = VALUES(customer_name),
                phone = VALUES(phone),
                address = VALUES(address),
                city = VALUES(city),
                state = VALUES(state),
                pincode = VALUES(pincode)`,
            [
                buyerId,
                cleanName,
                cleanPhone,
                cleanAddress,
                cleanCity,
                cleanState,
                cleanPincode
            ]
        );

        const [saved] = await pool.query(
            `SELECT
                id,
                buyer_id,
                customer_name,
                phone,
                address,
                city,
                state,
                pincode
             FROM saved_addresses
             WHERE buyer_id = ?`,
            [buyerId]
        );

        res.json({
            success: true,
            message: "Delivery address saved successfully",
            address: saved[0]
        });

    } catch (error) {
        console.error("SAVE ADDRESS ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to save delivery address"
        });
    }
};


// ====================================
// DELETE SAVED ADDRESS
// ====================================

const deleteSavedAddress = async (req, res) => {
    try {
        const buyerId = Number(req.params.id);

        if (!Number.isInteger(buyerId) || buyerId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid buyer ID"
            });
        }

        const [result] = await pool.query(
            "DELETE FROM saved_addresses WHERE buyer_id = ?",
            [buyerId]
        );

        res.json({
            success: true,
            message:
                result.affectedRows > 0
                    ? "Saved address deleted successfully"
                    : "No saved address found"
        });

    } catch (error) {
        console.error("DELETE ADDRESS ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to delete saved address"
        });
    }
};


module.exports = {
    getSavedAddress,
    saveAddress,
    deleteSavedAddress
};