import { getShirtMeasurementByCustomerId, getShirtMeasurementByOrderNo, createShirtMeasurement, updateShirtMeasurement } from '../services/shirtMeasurementService.js';
import express from 'express';
import passport from '../passportConfig.js';

const router = express.Router();

//SHIRT MEASUREMENT ROUTES

//get shirt measurement by customer id
router.get("/shirtMeasurement/customer/:id", passport.authenticate('bearer', { session: false }), async (req, res) => {
    const id = req.params.id;
    const shirtMeasurement = await getShirtMeasurementByCustomerId(id);
    res.send(shirtMeasurement);
})

//get shirt measurement by order number
router.get("/shirtMeasurement/order/:orderNo", passport.authenticate('bearer', { session: false }), async (req, res) => {
    const orderNo = req.params.orderNo;
    const shirtMeasurement = await getShirtMeasurementByOrderNo(orderNo);
    res.send(shirtMeasurement);
})

//create a new shirt measurement
router.post("/shirtMeasurement/:customerid/:orderNo", passport.authenticate('bearer', { session: false }), async (req, res) => {
    try {
        const { customerid, orderNo } = req.params;
        const data = { ...req.body, customer_id: customerid, orderNo: orderNo };
        const result = await createShirtMeasurement(data);
        res.status(201).send(result);
    } catch (error) {
        console.error('Error creating shirt measurement:', error);
        res.status(500).send({ message: 'Failed to create shirt measurement', error: error.message });
    }
});

// Update shirt measurement
router.put("/shirtMeasurement/:measurementId", passport.authenticate('bearer', { session: false }), async (req, res) => {
    try {
        const { measurementId } = req.params;
        const data = req.body;
        await updateShirtMeasurement(measurementId, data);
        res.send({ message: 'Shirt measurement updated successfully' });
    } catch (error) {
        console.error('Error updating shirt measurement:', error);
        res.status(500).send({ message: 'Failed to update shirt measurement', error: error.message });
    }
});

export default router;