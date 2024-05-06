import express from 'express';
import { getCustomerById, getCustomers, searchCustomers, createCustomer, updateCustomer } from '../services/customerService.js';

const router = express.Router();

//CUSTOMER ROUTES

// Get all customers
router.get("/customers", async (req, res) => {
    const customers = await getCustomers();
    res.send(customers);
})

// Get a customer by ID
router.get("/customer/:id", async (req, res) => {
    const id = req.params.id;
    const customer = await getCustomerById(id);
    res.send(customer);
})

// Search for customers by name or mobile number
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

// Create a new customer
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

// Update an existing customer
router.put("/customer/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const updateResult = await updateCustomer(id, req.body);
        if (updateResult.affectedRows > 0) {
            res.send({ message: 'Customer updated successfully' });
        } else {
            res.status(404).send({ message: 'Customer not found' });
        }
    } catch (error) {
        console.error('Failed to update customer:', error);
        res.status(500).send({ message: 'Failed to update customer', error: error.message });
    }
});

export default router;