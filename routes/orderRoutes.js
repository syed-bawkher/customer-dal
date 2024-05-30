import express from "express";
import { getOrders, getOrderById, getOrdersByCustomerId, createOrder, deleteOrder } from "../services/orderService.js";

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

// Express route to create a new order
router.post("/order/:customerId", async (req, res) => {
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
router.delete("/order/:id", async (req, res) => {
    const orderNo = req.params.id;
    try {
        await deleteOrder(orderNo);
        res.status(200).send({ message: `Order ${orderNo} and all associated entities have been deleted successfully.` });
    } catch (error) {
        console.error('Failed to delete order:', error);
        res.status(500).send({ message: 'Failed to delete order', error: error.message });
    }
});


export default router;