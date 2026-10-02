const express = require("express");

const {
  getClinicalNotes,
  getClinicalNoteById,
  createClinicalNote,
  updateClinicalNote,
  deleteClinicalNote
} = require("../controllers/clinicalNoteController");

const authMiddleware = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");

const router = express.Router();


// ===============================
// CLINICAL NOTES
// ===============================

router
  .route("/")
  .get(
    authMiddleware,
    allowRoles("admin", "doctor", "staff", "viewer"),
    getClinicalNotes
  )
  .post(
    authMiddleware,
    allowRoles("admin", "doctor", "staff"),
    createClinicalNote
  );


// ===============================
// SINGLE CLINICAL NOTE
// ===============================

router
  .route("/:id")
  .get(
    authMiddleware,
    allowRoles("admin", "doctor", "staff", "viewer"),
    getClinicalNoteById
  )
  .put(
    authMiddleware,
    allowRoles("admin", "doctor", "staff"),
    updateClinicalNote
  )
  .delete(
    authMiddleware,
    allowRoles("admin"),
    deleteClinicalNote
  );


module.exports = router;