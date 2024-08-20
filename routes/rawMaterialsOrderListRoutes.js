import express from 'express';
import {
    getAllRawMaterialsOrders,
    getRawMaterialsOrderById,
    createRawMaterialsOrder,
    updateRawMaterialsOrder,
    deleteRawMaterialsOrder
} from '../services/rawMaterialsOrderListService.js';
import passport from '../passportConfig.js';

const router = express.Router();

// Get all raw materials orders
router.get("/raw-materials-orders", passport.authenticate('bearer', { session: false }), async (req, res) => {
    try {
        const orders = await getAllRawMaterialsOrders();
        res.send(orders);
    } catch (error) {
        console.error('Error getting raw materials orders:', error);
        res.status(500).send('Error retrieving raw materials orders: ' + error.message);
    }
});

// Get a raw materials order by ID
router.get("/raw-materials-order/:id", passport.authenticate('bearer', { session: false }), async (req, res) => {
    const id = req.params.id;
    try {
        const order = await getRawMaterialsOrderById(id);
        if (order) {
            res.send(order);
        } else {
            res.status(404).send({ message: 'Raw materials order not found' });
        }
    } catch (error) {
        console.error('Error getting raw materials order:', error);
        res.status(500).send('Error retrieving raw materials order: ' + error.message);
    }
});

// Create a new raw materials order
router.post("/raw-materials-order", passport.authenticate('bearer', { session: false }), async (req, res) => {
    const order = req.body;
    try {
        const result = await createRawMaterialsOrder(order);
        res.status(201).send({ message: 'Raw materials order created successfully', orderId: result.insertId });
    } catch (error) {
        res.status(500).send({ message: 'Failed to create raw materials order', error: error.message });
    }
});

// Update an existing raw materials order
router.put("/raw-materials-order/:id", passport.authenticate('bearer', { session: false }), async (req, res) => {
    const { id } = req.params;
    try {
        const updateResult = await updateRawMaterialsOrder(id, req.body);
        if (updateResult.affectedRows > 0) {
            res.send({ message: 'Raw materials order updated successfully' });
        } else {
            res.status(404).send({ message: 'Raw materials order not found' });
        }
    } catch (error) {
        console.error('Failed to update raw materials order:', error);
        res.status(500).send({ message: 'Failed to update raw materials order', error: error.message });
    }
});

// Delete a raw materials order
router.delete("/raw-materials-order/:id", passport.authenticate('bearer', { session: false }), async (req, res) => {
    const { id } = req.params;
    try {
        const deleteResult = await deleteRawMaterialsOrder(id);
        if (deleteResult.affectedRows > 0) {
            res.send({ message: 'Raw materials order deleted successfully' });
        } else {
            res.status(404).send({ message: 'Raw materials order not found' });
        }
    } catch (error) {
        console.error('Failed to delete raw materials order:', error);
        res.status(500).send({ message: 'Failed to delete raw materials order', error: error.message });
    }
});

export default router;
