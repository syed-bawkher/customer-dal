import express from 'express';
import { getCustomerById, getCustomers, searchCustomers, createCustomer } from './services/customerService.js';
import { getOrders, getOrderById, getOrdersByCustomerId } from './services/orderService.js';
import { getJacketMeasurementByCustomerId, getJacketMeasurementByOrderNo } from './services/jacketMeasurementService.js';
import { getShirtMeasurementByCustomerId, getShirtMeasurementByOrderNo } from './services/shirtMeasurementService.js';
import { getPantMeasurementByCustomerId, getPantMeasurementByOrderNo } from './services/pantMeasurementService.js';

const app = express();
app.use(express.json()); // to parse JSON bodies

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

app.get("/customers/search", async (req, res) => {
    const { query } = req.query; // Access the search query parameter
    if (!query) {
        return res.status(400).send('Search query is required');
    }
    try {
        const results = await searchCustomers(query);
        res.send(results);
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).send('Error searching for customers: ' + error.message);
    }
});

app.post("/customer", async (req, res) => {
    const { firstName, lastName, mobile, add1, middleName, add2, add3, add4, email, officePhone, residentialPhone, lastOrderedDate } = req.body;
    try {
        if (!firstName || !lastName || !mobile || !add1) {
            return res.status(400).send({ message: 'Missing required fields. First name, last name, mobile number, and address1 are required.' });
        }
        const result = await createCustomer(firstName, lastName, mobile, add1, middleName, add2, add3, add4, email, officePhone, residentialPhone, lastOrderedDate);
        res.status(201).send({ message: 'Customer created successfully', customerId: result.insertId });
    } catch (error) {
        res.status(500).send({ message: 'Failed to create customer', error: error.message });
    }
});


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

app.get("/jacketMeasurement/order/:orderNo", async (req, res) => {
    const orderNo = req.params.orderNo;
    const jacketMeasurement = await getJacketMeasurementByOrderNo(orderNo);
    res.send(jacketMeasurement);
})

//SHIRT MEASUREMENT ROUTES
app.get("/shirtMeasurement/customer/:id", async (req, res) => {
    const id = req.params.id;
    const shirtMeasurement = await getShirtMeasurementByCustomerId(id);
    res.send(shirtMeasurement);
})

app.get("/shirtMeasurement/order/:orderNo", async (req, res) => {
    const orderNo = req.params.orderNo;
    const shirtMeasurement = await getShirtMeasurementByOrderNo(orderNo);
    res.send(shirtMeasurement);
})

//PANT MEASUREMENT ROUTES
app.get("/pantMeasurement/customer/:id", async (req, res) => {
    const id = req.params.id;
    const pantMeasurement = await getPantMeasurementByCustomerId(id);
    res.send(pantMeasurement);
})

app.get("/pantMeasurement/order/:orderNo", async (req, res) => {
    const orderNo = req.params.orderNo;
    const pantMeasurement = await getPantMeasurementByOrderNo(orderNo);
    res.send(pantMeasurement);
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