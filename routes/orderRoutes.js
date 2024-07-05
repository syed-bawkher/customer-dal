import express from "express";
import { getOrders, getOrderById, getOrdersByCustomerId, createOrder, deleteOrder, getOrderPhotoCount, generatePresignedUrl, getOrderPhotos } from "../services/orderService.js";
import passport from '../passportConfig.js';

const router = express.Router();

//ORDER ROUTES

//get all orders
router.get("/orders", passport.authenticate('bearer', { session: false }), async (req, res) => {
    const orders = await getOrders();
    res.send(orders);
})

// Get an order by ID
router.get("/order/:id", passport.authenticate('bearer', { session: false }), async (req, res) => {
    const id = req.params.id;
    const order = await getOrderById(id);
    res.send(order);
})

//get orders by customer id
router.get("/orders/customer/:id", passport.authenticate('bearer', { session: false }), async (req, res) => {
    const id = req.params.id;
    const orders = await getOrdersByCustomerId(id);
    res.send(orders);
})

// Express route to create a new order
router.post("/order/:customerId", passport.authenticate('bearer', { session: false }), async (req, res) => {
    const customerId = req.params.customerId;
    const { orderNo, date, note } = req.body;
    const orderDate = date || new Date().toISOString().split('T')[0];

    try {
        if (!orderNo || !customerId) {
            return res.status(400).send({ message: 'Missing required order details. Order number and customer ID are required.' });
        }
        const result = await createOrder(orderNo, customerId, orderDate, note);
        // Ensure the order number is returned in the response
        res.status(201).send({ message: 'Order created successfully', orderNo: result.orderNo });
    } catch (error) {
        console.error('Failed to create order:', error);
        res.status(500).send({ message: 'Failed to create order', error: error.message });
    }
});

// Delete an order by ID
router.delete("/order/:id", passport.authenticate('bearer', { session: false }), async (req, res) => {
    const orderNo = req.params.id;
    try {
        await deleteOrder(orderNo);
        res.status(200).send({ message: `Order ${orderNo} and all associated entities have been deleted successfully.` });
    } catch (error) {
        console.error('Failed to delete order:', error);
        res.status(500).send({ message: 'Failed to delete order', error: error.message });
    }
});

// Upload Photo (Get Presigned URL)
router.post("/order/:orderNo/upload-photo", async (req, res) => {
    const { orderNo } = req.params;
    const { filename } = req.body;

    try {
        const photoCount = await getOrderPhotoCount(orderNo);
        if (photoCount >= 5) {
            return res.status(400).send({ message: 'Maximum of 5 photos can be uploaded per order.' });
        }

        const s3Key = `orders/${orderNo}/${filename}`;
        const url = await generatePresignedUrl(orderNo, s3Key);

        res.status(200).send({ url });
    } catch (error) {
        console.error('Failed to generate presigned URL:', error);
        res.status(500).send({ message: 'Failed to generate presigned URL', error: error.message });
    }
});

router.get("/order/:orderNo/photos", async (req, res) => {
    const { orderNo } = req.params;

    try {
        const photoUrls = await getOrderPhotos(orderNo);

        res.status(200).send({ photoUrls });
    } catch (error) {
        console.error('Failed to retrieve order photos:', error);
        res.status(500).send({ message: 'Failed to retrieve order photos', error: error.message });
    }
});


export default router;