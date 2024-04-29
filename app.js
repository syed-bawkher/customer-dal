import express from 'express';
import { getCustomerById, getCustomers } from './services/customerService.js';
import { getOrders, getOrderById, getOrdersByCustomerId } from './services/orderService.js';
import { getJacketMeasurementByCustomerId } from './services/jacketMeasurementService.js';
import { getShirtMeasurementByCustomerId } from './services/shirtMeasurementService.js';
import { getPantMeasurementByCustomerId } from './services/pantMeasurementService.js';

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

//JACKET MEASUREMENT ROUTES
app.get("/jacketMeasurement/customer/:id", async (req, res) => {
    const id = req.params.id;
    const jacketMeasurement = await getJacketMeasurementByCustomerId(id);
    res.send(jacketMeasurement);
})

//SHIRT MEASUREMENT ROUTES
app.get("/shirtMeasurement/customer/:id", async (req, res) => {
    const id = req.params.id;
    const jacketMeasurement = await getShirtMeasurementByCustomerId(id);
    res.send(jacketMeasurement);
})

//PANT MEASUREMENT ROUTES
app.get("/pantMeasurement/customer/:id", async (req, res) => {
    const id = req.params.id;
    const jacketMeasurement = await getPantMeasurementByCustomerId(id);
    res.send(jacketMeasurement);
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