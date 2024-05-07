import { getPantMeasurementByCustomerId, getPantMeasurementByOrderNo, createPantMeasurement } from '../services/pantMeasurementService.js';
import express from 'express';

const router = express.Router();

//PANT MEASUREMENT ROUTES

//get pant measurement by customer id
router.get("/pantMeasurement/customer/:id", async (req, res) => {
    const id = req.params.id;
    const pantMeasurement = await getPantMeasurementByCustomerId(id);
    res.send(pantMeasurement);
})

//get pant measurement by order number
router.get("/pantMeasurement/order/:orderNo", async (req, res) => {
    const orderNo = req.params.orderNo;
    const pantMeasurement = await getPantMeasurementByOrderNo(orderNo);
    res.send(pantMeasurement);
})

//create a new pant measurement
router.post("/pantMeasurement/:customerid/:orderNo", async (req, res) => {
    try {
        const { customerid, orderNo } = req.params;
        const data = { ...req.body, customer_id: customerid, orderNo: orderNo };
        const result = await createPantMeasurement(data);
        res.status(201).send(result);
    } catch (error) {
        console.error('Error creating pant measurement:', error);
        res.status(500).send({ message: 'Failed to create pant measurement', error: error.message });
    }
});

export default router;