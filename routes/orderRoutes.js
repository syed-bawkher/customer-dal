import express from "express";
import { getOrders, getOrderById, getOrdersByCustomerId, createOrder } from "../services/orderService.js";

const router = express.Router();

//ORDER ROUTES

//get all orders
router.get("/orders", async (req, res) => {
    const orders = await getOrders();
    res.send(orders);
})

// Get an order by ID
router.get("/order/:id", async (req, res) => {
    const id = req.params.id;
    const order = await getOrderById(id);
    res.send(order);
})

//get orders by customer id
router.get("/orders/customer/:id", async (req, res) => {
    const id = req.params.id;
    const orders = await getOrdersByCustomerId(id);
    res.send(orders);
})

// Create a new order
router.post("/order/:customerId", async (req, res) => {
    const customerId = req.params.customerId;  // Extract customerId from URL
    const { orderNo, date, note } = req.body;  // Extract orderNo, date, and note from request body

    // Check if a date is provided; if not, use the current date
    const orderDate = date || new Date().toISOString().split('T')[0];  // Format the date as 'YYYY-MM-DD'

    try {
        if (!orderNo || !customerId) {
            return res.status(400).send({ message: 'Missing required order details. Order number and customer ID are required.' });
        }
        const result = await createOrder(orderNo, customerId, orderDate, note);
        res.status(201).send({ message: 'Order created successfully', order: result });
    } catch (error) {
        console.error('Failed to create order:', error);
        res.status(500).send({ message: 'Failed to create order', error: error.message });
    }
});

export default router;