import express from 'express';
import { getCustomerById, getCustomers } from './services/customerService.js';
import { getOrders, getOrderById, getOrdersByCustomerId } from './services/orderService.js';

const app = express();


//CUSTOMER ROUTES
app.get("/customers", async (req, res) => {
    const customers = await getCustomers();
    res.send(customers);
})

app.get("/customer/:id", async (req, res) => {
    const id = req.params.id;
    const customer = await getCustomerById(id);
    res.send(customer);
})

//ORDER ROUTES
app.get("/orders", async (req, res) => {
    const orders = await getOrders();
    res.send(orders);
})

app.get("/order/:id", async (req, res) => {
    const id = req.params.id;
    const order = await getOrderById(id);
    res.send(order);
})

app.get("/orders/customer/:id", async (req, res) => {
    const id = req.params.id;
    const orders = await getOrdersByCustomerId(id);
    res.send(orders);
})


//ERROR HANDLING
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
})

//START SERVER
app.listen(8080, () => {
    console.log('Server is running on port 8080');
})