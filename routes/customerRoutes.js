import express from 'express';
import { getCustomerById, getCustomers, searchCustomers, createCustomer } from '../services/customerService.js';

const router = express.Router();

//CUSTOMER ROUTES
router.get("/customers", async (req, res) => {
    const customers = await getCustomers();
    res.send(customers);
})

router.get("/customer/:id", async (req, res) => {
    const id = req.params.id;
    const customer = await getCustomerById(id);
    res.send(customer);
})

router.get("/customers/search", async (req, res) => {
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

router.post("/customer", async (req, res) => {
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

export default router;