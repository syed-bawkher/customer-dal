import express from "express";
import { getOrders, getOrderById, getOrdersByCustomerId } from "../services/orderService.js";

const router = express.Router();

//ORDER ROUTES
router.get("/orders", async (req, res) => {
    const orders = await getOrders();
    res.send(orders);
})

router.get("/order/:id", async (req, res) => {
    const id = req.params.id;
    const order = await getOrderById(id);
    res.send(order);
})

router.get("/orders/customer/:id", async (req, res) => {
    const id = req.params.id;
    const orders = await getOrdersByCustomerId(id);
    res.send(orders);
})

export default router;