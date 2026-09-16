const express = require("express");

const router = express.Router();

const {
  createHandover,
  getHandoversByPatient,
  getHandoverById,
  updateHandover,
  acknowledgeHandover,
  deleteHandover,
} = require("../controllers/handoverController");

const { protect, authorize } = require("../middleware/authMiddleware");

// Get all handovers for a patient
router.get(
  "/patient/:patientId",
  protect,
  getHandoversByPatient
);

// Get one handover
router.get("/:id", protect, getHandoverById);

// Create handover
router.post(
  "/",
  protect,
  authorize("Doctor", "Nurse", "Admin"),
  createHandover
);

// Update handover
router.put(
  "/:id",
  protect,
  authorize("Doctor", "Nurse", "Admin"),
  updateHandover
);

// Acknowledge handover
router.put(
  "/:id/acknowledge",
  protect,
  authorize("Doctor", "Nurse", "Admin"),
  acknowledgeHandover
);

// Delete handover
router.delete(
  "/:id",
  protect,
  authorize("Admin"),
  deleteHandover
);

module.exports = router;