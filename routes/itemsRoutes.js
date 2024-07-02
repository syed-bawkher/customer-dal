import express from 'express';
import {
  getAllItems, getItemById, createJacket, createShirt, createPant, updateItem, deleteItem, createItems, getItemsByOrderNo
} from '../services/itemsService.js';
import passport from '../passportConfig.js';

const router = express.Router();

// ITEM ROUTES

// Get all items
router.get("/items", passport.authenticate('bearer', { session: false }), async (req, res) => {
    try {
        const items = await getAllItems();
        res.send(items);
    } catch (error) {
        console.error('Error getting items:', error);
        res.status(500).send('Error retrieving items: ' + error.message);
    }
});

// Create multiple items for the same order
router.post("/items", passport.authenticate('bearer', { session: false }), async (req, res) => {
    const { orderNo, items } = req.body;
    try {
        if (!items || items.length === 0) {
            return res.status(400).send({ message: 'No items provided' });
        }
        const result = await createItems(orderNo, items); // Assuming createItems handles multiple items
        res.status(201).send({
            message: 'Items created successfully',
            itemsCreated: result.length
        });
    } catch (error) {
        res.status(500).send({ message: 'Failed to create items', error: error.message });
    }
});

router.get("/items/order/:orderNo", passport.authenticate('bearer', { session: false }), async (req, res) => {
    const orderNo = req.params.orderNo;
    try {
        const items = await getItemsByOrderNo(orderNo);
        res.send(items);
    }
    catch (error) {
        console.error('Error getting items:', error);
        res.status(500).send('Error retrieving items: ' + error.message);
    }
})


// Get an item by ID
router.get("/item/:id", passport.authenticate('bearer', { session: false }), async (req, res) => {
    const id = req.params.id;
    try {
        const item = await getItemById(id);
        if (item) {
            res.send(item);
        } else {
            res.status(404).send({ message: 'Item not found' });
        }
    } catch (error) {
        console.error('Error getting item:', error);
        res.status(500).send('Error retrieving item: ' + error.message);
    }
});

// Create a new jacket
router.post("/item/jacket", passport.authenticate('bearer', { session: false }), async (req, res) => {
    const { orderNo, item_name, jacket_measurement_id, fabric_id, lining_id } = req.body;
    try {
        const result = await createJacket(orderNo, item_name, jacket_measurement_id, fabric_id, lining_fabric_id);
        res.status(201).send({ message: 'Jacket created successfully', itemId: result.insertId });
    } catch (error) {
        res.status(500).send({ message: 'Failed to create jacket', error: error.message });
    }
});

// Create a new shirt
router.post("/item/shirt", passport.authenticate('bearer', { session: false }), async (req, res) => {
    const { orderNo, item_name, shirt_measurement_id, fabric_id, lining_fabric_id } = req.body;
    try {
        const result = await createShirt(orderNo, item_name, shirt_measurement_id, fabric_id, lining_fabric_id);
        res.status(201).send({ message: 'Shirt created successfully', itemId: result.insertId });
    } catch (error) {
        res.status(500).send({ message: 'Failed to create shirt', error: error.message });
    }
});

// Create a new pant
router.post("/item/pant", passport.authenticate('bearer', { session: false }), async (req, res) => {
    const { orderNo, item_name, pant_measurement_id, fabric_id, lining_fabric_id } = req.body;
    try {
        const result = await createPant(orderNo, item_name, pant_measurement_id, fabric_id, lining_fabric_id);
        res.status(201).send({ message: 'Pant created successfully', itemId: result.insertId });
    } catch (error) {
        res.status(500).send({ message: 'Failed to create pant', error: error.message });
    }
});

// Update an existing item
router.put("/item/:id", passport.authenticate('bearer', { session: false }), async (req, res) => {
    const { id } = req.params;
    try {
        const updateResult = await updateItem(id, req.body);
        if (updateResult.affectedRows > 0) {
            res.send({ message: 'Item updated successfully' });
        } else {
            res.status(404).send({ message: 'Item not found' });
        }
    } catch (error) {
        console.error('Failed to update item:', error);
        res.status(500).send({ message: 'Failed to update item', error: error.message });
    }
});

// Delete an item
router.delete("/item/:id", passport.authenticate('bearer', { session: false }), async (req, res) => {
    const { id } = req.params;
    try {
        const deleteResult = await deleteItem(id);
        if (deleteResult.affectedRows > 0) {
            res.send({ message: 'Item deleted successfully' });
        } else {
            res.status(404).send({ message: 'Item not found' });
        }
    } catch (error) {
        console.error('Failed to delete item:', error);
        res.status(500).send({ message: 'Failed to delete item', error: error.message });
    }
});

export default router;
