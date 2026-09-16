const express = require("express");

const router = express.Router();

const {
  createAlert,
  getAlertsByPatient,
  getActiveAlerts,
  getAlertById,
  acknowledgeAlert,
  resolveAlert,
  deleteAlert,
} = require("../controllers/alertController");

const { protect, authorize } = require("../middleware/authMiddleware");

// Get all active alerts
router.get("/active", protect, getActiveAlerts);

// Get alerts for a specific patient
router.get(
  "/patient/:patientId",
  protect,
  getAlertsByPatient
);

// Get one alert
router.get("/:id", protect, getAlertById);

// Create alert
router.post(
  "/",
  protect,
  authorize("Doctor", "Nurse", "Admin"),
  createAlert
);

// Acknowledge alert
router.put(
  "/:id/acknowledge",
  protect,
  authorize("Doctor", "Nurse", "Admin"),
  acknowledgeAlert
);

// Resolve alert
router.put(
  "/:id/resolve",
  protect,
  authorize("Doctor", "Nurse", "Admin"),
  resolveAlert
);

// Delete alert
router.delete(
  "/:id",
  protect,
  authorize("Admin"),
  deleteAlert
);

module.exports = router;