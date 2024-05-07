import { getJacketMeasurementByCustomerId, getJacketMeasurementByOrderNo, createJacketMeasurement } from '../services/jacketMeasurementService.js';
import express from 'express';

const router = express.Router();

//JACKET MEASUREMENT ROUTES

//get jacket measurement by customer id
router.get("/jacketMeasurement/customer/:id", async (req, res) => {
    const id = req.params.id;
    const jacketMeasurement = await getJacketMeasurementByCustomerId(id);
    res.send(jacketMeasurement);
})

//get jacket measurement by order number
router.get("/jacketMeasurement/order/:orderNo", async (req, res) => {
    const orderNo = req.params.orderNo;
    const jacketMeasurement = await getJacketMeasurementByOrderNo(orderNo);
    res.send(jacketMeasurement);
})

//create a new jacket measurement
router.post("/jacketMeasurement/:customerid/:orderNo", async (req, res) => {
    try {
        const { customerid, orderNo } = req.params;
        const data = { ...req.body, customer_id: customerid, orderNo: orderNo };
        const result = await createJacketMeasurement(data);
        res.status(201).send(result);
    } catch (error) {
        console.error('Error creating jacket measurement:', error);
        res.status(500).send({ message: 'Failed to create jacket measurement', error: error.message });
    }
});

export default router;