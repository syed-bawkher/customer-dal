import { getPantMeasurementByCustomerId, getPantMeasurementByOrderNo } from '../services/pantMeasurementService.js';
import express from 'express';

const router = express.Router();

//PANT MEASUREMENT ROUTES
router.get("/pantMeasurement/customer/:id", async (req, res) => {
    const id = req.params.id;
    const pantMeasurement = await getPantMeasurementByCustomerId(id);
    res.send(pantMeasurement);
})

router.get("/pantMeasurement/order/:orderNo", async (req, res) => {
    const orderNo = req.params.orderNo;
    const pantMeasurement = await getPantMeasurementByOrderNo(orderNo);
    res.send(pantMeasurement);
})

export default router;