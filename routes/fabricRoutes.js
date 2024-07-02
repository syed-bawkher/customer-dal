import express from 'express';
import {
    getAllFabrics,
    getFabricById,
    createFabric,
    updateFabric,
    deleteFabric
} from '../services/fabricService.js';
import passport from '../passportConfig.js';

const router = express.Router();

// FABRIC ROUTES

// Get all fabrics
router.get("/fabrics", passport.authenticate('bearer', { session: false }), async (req, res) => {
    try {
        const fabrics = await getAllFabrics();
        res.send(fabrics);
    } catch (error) {
        console.error('Error getting fabrics:', error);
        res.status(500).send('Error retrieving fabrics: ' + error.message);
    }
});

// Get a fabric by ID
router.get("/fabric/:id", passport.authenticate('bearer', { session: false }), async (req, res) => {
    const id = req.params.id;
    try {
        const fabric = await getFabricById(id);
        if (fabric) {
            res.send(fabric);
        } else {
            res.status(404).send({ message: 'Fabric not found' });
        }
    } catch (error) {
        console.error('Error getting fabric:', error);
        res.status(500).send('Error retrieving fabric: ' + error.message);
    }
});

// Create a new fabric
router.post("/fabric", passport.authenticate('bearer', { session: false }), async (req, res) => {
    const fabric = req.body;
    try {
        const result = await createFabric(fabric);
        res.status(201).send({ message: 'Fabric created successfully', fabricId: result.insertId });
    } catch (error) {
        res.status(500).send({ message: 'Failed to create fabric', error: error.message });
    }
});

// Update an existing fabric
router.put("/fabric/:id", passport.authenticate('bearer', { session: false }), async (req, res) => {
    const { id } = req.params;
    try {
        const updateResult = await updateFabric(id, req.body);
        if (updateResult.affectedRows > 0) {
            res.send({ message: 'Fabric updated successfully' });
        } else {
            res.status(404).send({ message: 'Fabric not found' });
        }
    } catch (error) {
        console.error('Failed to update fabric:', error);
        res.status(500).send({ message: 'Failed to update fabric', error: error.message });
    }
});

// Delete a fabric
router.delete("/fabric/:id", passport.authenticate('bearer', { session: false }), async (req, res) => {
    const { id } = req.params;
    try {
        const deleteResult = await deleteFabric(id);
        if (deleteResult.affectedRows > 0) {
            res.send({ message: 'Fabric deleted successfully' });
        } else {
            res.status(404).send({ message: 'Fabric not found' });
        }
    } catch (error) {
        console.error('Failed to delete fabric:', error);
        res.status(500).send({ message: 'Failed to delete fabric', error: error.message });
    }
});

export default router;
