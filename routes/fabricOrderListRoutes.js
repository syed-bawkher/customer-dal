import express from "express";
import {
  getAllFabricOrders,
  getFabricOrderById,
  createFabricOrder,
  updateFabricOrder,
  deleteFabricOrder,
  getFabricOrdersByFabricCode,
} from "../services/fabricOrderListService.js";
import passport from "../passportConfig.js";

const router = express.Router();

// Get all fabric orders
router.get(
  "/fabric-orders",
  passport.authenticate("bearer", { session: false }),
  async (req, res) => {
    try {
      const orders = await getAllFabricOrders();
      res.send(orders);
    } catch (error) {
      console.error("Error getting fabric orders:", error);
      res.status(500).send("Error retrieving fabric orders: " + error.message);
    }
  }
);

// Get a fabric order by ID
router.get(
  "/fabric-order/:id",
  passport.authenticate("bearer", { session: false }),
  async (req, res) => {
    const id = req.params.id;
    try {
      const order = await getFabricOrderById(id);
      if (order) {
        res.send(order);
      } else {
        res.status(404).send({ message: "Fabric order not found" });
      }
    } catch (error) {
      console.error("Error getting fabric order:", error);
      res.status(500).send("Error retrieving fabric order: " + error.message);
    }
  }
);

// Create a new fabric order
router.post(
  "/fabric-order",
  passport.authenticate("bearer", { session: false }),
  async (req, res) => {
    const order = req.body;
    try {
      const result = await createFabricOrder(order);
      res
        .status(201)
        .send({
          message: "Fabric order created successfully",
          orderId: result.insertId,
        });
    } catch (error) {
      res
        .status(500)
        .send({
          message: "Failed to create fabric order",
          error: error.message,
        });
    }
  }
);


// Update an existing fabric order
router.put(
  "/fabric-order/:id",
  passport.authenticate("bearer", { session: false }),
  async (req, res) => {
    const { id } = req.params;
    try {
      const updateResult = await updateFabricOrder(id, req.body);
      if (updateResult.affectedRows > 0) {
        res.send({ message: "Fabric order updated successfully" });
      } else {
        res.status(404).send({ message: "Fabric order not found" });
      }
    } catch (error) {
      console.error("Failed to update fabric order:", error);
      res
        .status(500)
        .send({
          message: "Failed to update fabric order",
          error: error.message,
        });
    }
  }
);

// Delete a fabric order
router.delete(
  "/fabric-order/:id",
  passport.authenticate("bearer", { session: false }),
  async (req, res) => {
    const { id } = req.params;
    try {
      const deleteResult = await deleteFabricOrder(id);
      if (deleteResult.affectedRows > 0) {
        res.send({ message: "Fabric order deleted successfully" });
      } else {
        res.status(404).send({ message: "Fabric order not found" });
      }
    } catch (error) {
      console.error("Failed to delete fabric order:", error);
      res
        .status(500)
        .send({
          message: "Failed to delete fabric order",
          error: error.message,
        });
    }
  }
);

// Get all fabric orders by fabric code
router.get(
  "/fabric-orders/code/:fabricCode",
  passport.authenticate("bearer", { session: false }),
  async (req, res) => {
    const { fabricCode } = req.params;
    try {
      const orders = await getFabricOrdersByFabricCode(fabricCode);
      if (orders.length > 0) {
        res.send(orders);
      } else {
        res
          .status(404)
          .send({
            message: "No fabric orders found for the provided fabric code",
          });
      }
    } catch (error) {
      console.error("Error getting fabric orders by fabric code:", error);
      res.status(500).send("Error retrieving fabric orders: " + error.message);
    }
  }
);

export default router;
