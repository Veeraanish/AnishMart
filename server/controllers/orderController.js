const pool = require("../config/db");


// ==========================================
// BUYER: CREATE ORDER
// ==========================================
const createOrder = async (req, res) => {

    const connection = await pool.getConnection();

    try {

        const {
            buyer_id,
            customer_name,
            phone,
            address,
            city,
            state,
            pincode,
            payment_method
        } = req.body;


        // VALIDATE REQUIRED FIELDS
        if (
            !buyer_id ||
            !customer_name ||
            !phone ||
            !address ||
            !city ||
            !state ||
            !pincode ||
            !payment_method
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "All customer, delivery and payment details are required"
            });
        }


        // VALIDATE PAYMENT METHOD
        const allowedPaymentMethods = [
            "COD",
            "ONLINE"
        ];

        if (!allowedPaymentMethods.includes(payment_method)) {
            return res.status(400).json({
                success: false,
                message: "Invalid payment method"
            });
        }


        // VALIDATE PHONE
        if (!/^[0-9]{10}$/.test(phone.trim())) {
            return res.status(400).json({
                success: false,
                message:
                    "Phone number must contain exactly 10 digits"
            });
        }


        // VALIDATE PINCODE
        if (!/^[0-9]{6}$/.test(pincode.trim())) {
            return res.status(400).json({
                success: false,
                message:
                    "Pincode must contain exactly 6 digits"
            });
        }


        await connection.beginTransaction();


        // GET BUYER CART
        const [cart] = await connection.query(
            `SELECT
                cart_items.product_id,
                cart_items.quantity,
                products.price,
                products.stock
             FROM cart_items
             JOIN products
             ON cart_items.product_id = products.id
             WHERE cart_items.buyer_id = ?
             FOR UPDATE`,
            [buyer_id]
        );


        // CART EMPTY CHECK
        if (cart.length === 0) {

            await connection.rollback();

            return res.status(400).json({
                success: false,
                message: "Cart is empty"
            });
        }


        // CHECK STOCK
        for (const item of cart) {

            if (
                Number(item.quantity) >
                Number(item.stock)
            ) {

                await connection.rollback();

                return res.status(400).json({
                    success: false,
                    message:
                        `Insufficient stock for product ID ${item.product_id}`
                });
            }
        }


        // CALCULATE TOTAL AMOUNT
        let totalAmount = 0;

        for (const item of cart) {

            totalAmount +=
                Number(item.price) *
                Number(item.quantity);
        }


        /*
            PAYMENT STATUS

            COD:
            Payment is collected later.
            So payment status = PENDING.

            ONLINE:
            Real payment gateway not connected yet.
            So payment status = PENDING.
        */
        const paymentStatus = "PENDING";


        // CREATE ORDER
        const [orderResult] =
            await connection.query(
                `INSERT INTO orders
                (
                    buyer_id,
                    customer_name,
                    phone,
                    address,
                    city,
                    state,
                    pincode,
                    total_amount,
                    payment_method,
                    payment_status
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    buyer_id,
                    customer_name.trim(),
                    phone.trim(),
                    address.trim(),
                    city.trim(),
                    state.trim(),
                    pincode.trim(),
                    totalAmount,
                    payment_method,
                    paymentStatus
                ]
            );


        const orderId =
            orderResult.insertId;


        // CREATE ORDER ITEMS + REDUCE STOCK
        for (const item of cart) {

            await connection.query(
                `INSERT INTO order_items
                (
                    order_id,
                    product_id,
                    quantity,
                    unit_price
                )
                VALUES (?, ?, ?, ?)`,
                [
                    orderId,
                    item.product_id,
                    item.quantity,
                    item.price
                ]
            );


            const [stockResult] =
                await connection.query(
                    `UPDATE products
                     SET stock = stock - ?
                     WHERE id = ?
                     AND stock >= ?`,
                    [
                        item.quantity,
                        item.product_id,
                        item.quantity
                    ]
                );


            if (
                stockResult.affectedRows === 0
            ) {

                await connection.rollback();

                return res.status(400).json({
                    success: false,
                    message:
                        `Unable to update stock for product ID ${item.product_id}`
                });
            }
        }


        // CLEAR CART
        await connection.query(
            `DELETE FROM cart_items
             WHERE buyer_id = ?`,
            [buyer_id]
        );


        // COMMIT TRANSACTION
        await connection.commit();


        // SUCCESS RESPONSE
        res.status(201).json({

            success: true,

            message:
                payment_method === "COD"
                    ? "Order placed successfully with Cash on Delivery"
                    : "Order created successfully. Online payment is pending.",

            order_id:
                orderId,

            total_amount:
                totalAmount,

            payment_method:
                payment_method,

            payment_status:
                paymentStatus

        });


    } catch (error) {

        try {
            await connection.rollback();
        } catch (rollbackError) {
            console.error(
                "ROLLBACK ERROR:",
                rollbackError
            );
        }


        console.error(
            "CREATE ORDER ERROR:",
            error
        );


        res.status(500).json({
            success: false,
            message:
                "Failed to create order"
        });


    } finally {

        connection.release();

    }
};



// ==========================================
// BUYER: ORDER HISTORY
// ==========================================
const getOrderHistory = async (
    req,
    res
) => {

    try {

        const {
            buyer_id
        } = req.params;


        const [orders] =
            await pool.query(
                `SELECT
                    id,
                    buyer_id,
                    customer_name,
                    phone,
                    address,
                    city,
                    state,
                    pincode,
                    total_amount,
                    payment_method,
                    status,
                    payment_status,
                    created_at
                 FROM orders
                 WHERE buyer_id = ?
                 ORDER BY created_at DESC`,
                [buyer_id]
            );


        res.json({
            success: true,
            orders: orders
        });


    } catch (error) {

        console.error(
            "ORDER HISTORY ERROR:",
            error
        );


        res.status(500).json({
            success: false,
            message:
                "Failed to fetch order history"
        });

    }

};



// ==========================================
// SELLER: GET ALL CUSTOMER ORDERS
// ==========================================
const getAllOrders = async (
    req,
    res
) => {

    try {

        const [orders] =
            await pool.query(
                `SELECT
                    o.id,
                    o.buyer_id,
                    u.name AS buyer_name,
                    u.email AS buyer_email,
                    o.customer_name,
                    o.phone,
                    o.address,
                    o.city,
                    o.state,
                    o.pincode,
                    o.total_amount,
                    o.payment_method,
                    o.status,
                    o.payment_status,
                    o.created_at
                 FROM orders o
                 JOIN users u
                 ON o.buyer_id = u.id
                 ORDER BY o.created_at DESC`
            );


        res.json({
            success: true,
            orders: orders
        });


    } catch (error) {

        console.error(
            "GET ALL ORDERS ERROR:",
            error
        );


        res.status(500).json({
            success: false,
            message:
                "Failed to fetch all customer orders"
        });

    }

};



// ==========================================
// SELLER: UPDATE ORDER STATUS
// ==========================================
const updateOrderStatus = async (
    req,
    res
) => {

    try {

        const {
            id
        } = req.params;


        const {
            status
        } = req.body;


        const allowedStatuses = [
            "PLACED",
            "PROCESSING",
            "SHIPPED",
            "DELIVERED",
            "CANCELLED"
        ];


        if (
            !allowedStatuses.includes(
                status
            )
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Invalid order status"
            });

        }


        const [result] =
            await pool.query(
                `UPDATE orders
                 SET status = ?
                 WHERE id = ?`,
                [
                    status,
                    id
                ]
            );


        if (
            result.affectedRows === 0
        ) {

            return res.status(404).json({
                success: false,
                message:
                    "Order not found"
            });

        }


        res.json({
            success: true,
            message:
                "Order status updated successfully"
        });


    } catch (error) {

        console.error(
            "UPDATE ORDER STATUS ERROR:",
            error
        );


        res.status(500).json({
            success: false,
            message:
                "Failed to update order status"
        });

    }

};



// ==========================================
// EXPORT
// ==========================================
module.exports = {
    createOrder,
    getOrderHistory,
    getAllOrders,
    updateOrderStatus
};
