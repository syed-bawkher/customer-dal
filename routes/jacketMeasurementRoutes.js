import { getJacketMeasurementByCustomerId, getJacketMeasurementByOrderNo } from '../services/jacketMeasurementService.js';
import express from 'express';

const router = express.Router();

//JACKET MEASUREMENT ROUTES
router.get("/jacketMeasurement/customer/:id", async (req, res) => {
    const id = req.params.id;
    const jacketMeasurement = await getJacketMeasurementByCustomerId(id);
    res.send(jacketMeasurement);
})

router.get("/jacketMeasurement/order/:orderNo", async (req, res) => {
    const orderNo = req.params.orderNo;
    const jacketMeasurement = await getJacketMeasurementByOrderNo(orderNo);
    res.send(jacketMeasurement);
})

export default router;