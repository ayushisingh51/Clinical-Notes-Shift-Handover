const express = require("express");

const {
  getPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient
} = require("../controllers/patientController");

const authMiddleware = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");

const router = express.Router();


// ===============================
// VIEW PATIENTS
// ===============================

router
  .route("/")
  .get(
    authMiddleware,
    allowRoles("admin", "doctor", "staff", "viewer"),
    getPatients
  )
  .post(
    authMiddleware,
    allowRoles("admin", "doctor", "staff"),
    createPatient
  );


// ===============================
// SINGLE PATIENT
// ===============================

router
  .route("/:id")
  .get(
    authMiddleware,
    allowRoles("admin", "doctor", "staff", "viewer"),
    getPatientById
  )
  .put(
    authMiddleware,
    allowRoles("admin", "doctor", "staff"),
    updatePatient
  )
  .delete(
    authMiddleware,
    allowRoles("admin"),
    deletePatient
  );


module.exports = router;