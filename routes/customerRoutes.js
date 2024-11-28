import express from 'express';
import { getCustomerById, getCustomers, searchCustomers, createCustomer, updateCustomer, mergeCustomers, getCustomerByOrderNo } from '../services/customerService.js';
import passport from '../passportConfig.js';

const router = express.Router();

//CUSTOMER ROUTES

// Get all customers
router.get("/customers", passport.authenticate('bearer', { session: false }), async (req, res) => {
    const customers = await getCustomers();
    res.send(customers);
})

// Get a customer by ID
router.get("/customer/:id", passport.authenticate('bearer', { session: false }), async (req, res) => {
    const id = req.params.id;
    const customer = await getCustomerById(id);
    res.send(customer);
})

// Search for customers by name or mobile number
router.get("/customers/search", passport.authenticate('bearer', { session: false }), async (req, res) => {
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

// Get a customer by order number
router.get("/customer/order/:orderNo", passport.authenticate('bearer', { session: false }), async (req, res) => {
    const orderNo = req.params.orderNo;
    try {
        const customer = await getCustomerByOrderNo(orderNo);
        if (customer) {
            res.send(customer);
        } else {
            res.status(404).send({ message: 'Customer not found for order number: ' + orderNo });
        }
    } catch (error) {
        console.error('Error getting customer by order number:', error);
        res.status(500).send({ message: 'Error getting customer by order number', error: error.message });
    }
});

// Create a new customer
router.post("/customer", passport.authenticate('bearer', { session: false }), async (req, res) => {
    const { first_name, last_name, mobile, add1, middle_name, add2, add3, add4, email, office_phone, residential_phone, last_ordered_date } = req.body;
    try {
        if (!first_name || !last_name || !mobile) {
            return res.status(400).send({ message: 'Missing required fields. First name, last name and mobile number are required.' });
        }
        const result = await createCustomer(first_name, last_name, mobile, add1, middle_name, add2, add3, add4, email, office_phone, residential_phone, last_ordered_date);
        res.status(201).send({ message: 'Customer created successfully', customerId: result.insertId });
    } catch (error) {
        res.status(500).send({ message: 'Failed to create customer', error: error.message });
    }
});

// Update an existing customer
router.put("/customer/:id", passport.authenticate('bearer', { session: false }), async (req, res) => {
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

// Merge customers
router.post("/customers/merge", passport.authenticate('bearer', { session: false }), async (req, res) => {
    const { customerIds } = req.body;
    if (!Array.isArray(customerIds) || customerIds.length < 2) {
        return res.status(400).send({ message: 'You must provide an array of at least two customer IDs to merge.' });
    }
    try {
        await mergeCustomers(customerIds);
        res.send({ message: 'Customers merged successfully into customer ID: ' + customerIds[0] });
    } catch (error) {
        console.error('Failed to merge customers:', error);
        res.status(500).send({ message: 'Failed to merge customers', error: error.message });
    }
});

export default router;