import express from "express";
import {
  getAllSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} from "../services/supplierService.js";
import passport from "../passportConfig.js";

const router = express.Router();

// Get all suppliers
router.get(
  "/suppliers",
  passport.authenticate("bearer", { session: false }),
  async (req, res) => {
    try {
      const suppliers = await getAllSuppliers();
      res.send(suppliers);
    } catch (error) {
      console.error("Error getting suppliers:", error);
      res.status(500).send("Error retrieving suppliers: " + error.message);
    }
  }
);

// Get a supplier by ID
router.get(
  "/supplier/:id",
  passport.authenticate("bearer", { session: false }),
  async (req, res) => {
    const id = req.params.id;
    try {
      const supplier = await getSupplierById(id);
      if (supplier) {
        res.send(supplier);
      } else {
        res.status(404).send({ message: "Supplier not found" });
      }
    } catch (error) {
      console.error("Error getting supplier:", error);
      res.status(500).send("Error retrieving supplier: " + error.message);
    }
  }
);

// Create a new supplier
router.post(
  "/supplier",
  passport.authenticate("bearer", { session: false }),
  async (req, res) => {
    const supplier = req.body;
    try {
      const result = await createSupplier(supplier);
      res
        .status(201)
        .send({
          message: "Supplier created successfully",
          supplierId: result.insertId,
        });
    } catch (error) {
      res
        .status(500)
        .send({
          message: "Failed to create supplier",
          error: error.message,
        });
    }
  }
);

// Update an existing supplier
router.put(
  "/supplier/:id",
  passport.authenticate("bearer", { session: false }),
  async (req, res) => {
    const { id } = req.params;
    try {
      const updateResult = await updateSupplier(id, req.body);
      if (updateResult.affectedRows > 0) {
        res.send({ message: "Supplier updated successfully" });
      } else {
        res.status(404).send({ message: "Supplier not found" });
      }
    } catch (error) {
      console.error("Failed to update supplier:", error);
      res
        .status(500)
        .send({
          message: "Failed to update supplier",
          error: error.message,
        });
    }
  }
);

// Delete a supplier
router.delete(
  "/supplier/:id",
  passport.authenticate("bearer", { session: false }),
  async (req, res) => {
    const { id } = req.params;
    try {
      const deleteResult = await deleteSupplier(id);
      if (deleteResult.affectedRows > 0) {
        res.send({ message: "Supplier deleted successfully" });
      } else {
        res.status(404).send({ message: "Supplier not found" });
      }
    } catch (error) {
      console.error("Failed to delete supplier:", error);
      res
        .status(500)
        .send({
          message: "Failed to delete supplier",
          error: error.message,
        });
    }
  }
);

export default router;
