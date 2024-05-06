import { getShirtMeasurementByCustomerId, getShirtMeasurementByOrderNo } from '../services/shirtMeasurementService.js';
import express from 'express';

const router = express.Router();

//SHIRT MEASUREMENT ROUTES
router.get("/shirtMeasurement/customer/:id", async (req, res) => {
    const id = req.params.id;
    const shirtMeasurement = await getShirtMeasurementByCustomerId(id);
    res.send(shirtMeasurement);
})

router.get("/shirtMeasurement/order/:orderNo", async (req, res) => {
    const orderNo = req.params.orderNo;
    const shirtMeasurement = await getShirtMeasurementByOrderNo(orderNo);
    res.send(shirtMeasurement);
})

export default router;