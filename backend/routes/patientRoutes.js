const express = require("express");
const router = express.Router();

const {
  createPatient,
  getPatients,
  getPatientById,
  updatePatient,
  deletePatient,
  searchPatients,
} = require("../controllers/patientController");

const { protect, authorize } = require("../middleware/authMiddleware");

// Search patients
router.get("/search", protect, searchPatients);

// Get all patients
router.get("/", protect, getPatients);

// Get single patient
router.get("/:id", protect, getPatientById);

// Create patient
router.post(
  "/",
  protect,
  authorize("Doctor", "Nurse", "Admin"),
  createPatient
);

// Update patient
router.put(
  "/:id",
  protect,
  authorize("Doctor", "Nurse", "Admin"),
  updatePatient
);

// Delete patient
router.delete(
  "/:id",
  protect,
  authorize("Admin"),
  deletePatient
);

module.exports = router;