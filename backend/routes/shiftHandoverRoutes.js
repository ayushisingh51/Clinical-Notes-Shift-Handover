const express = require("express");

const {
  getHandovers,
  getHandoverById,
  createHandover,
  updateHandover,
  deleteHandover,
} = require("../controllers/shiftHandoverController");

const authMiddleware = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");

const router = express.Router();


// ===============================
// SHIFT HANDOVERS
// ===============================

router
  .route("/")
  .get(
    authMiddleware,
    allowRoles("admin", "doctor", "staff", "viewer"),
    getHandovers
  )
  .post(
    authMiddleware,
    allowRoles("admin", "doctor", "staff"),
    createHandover
  );


// ===============================
// SINGLE SHIFT HANDOVER
// ===============================

router
  .route("/:id")
  .get(
    authMiddleware,
    allowRoles("admin", "doctor", "staff", "viewer"),
    getHandoverById
  )
  .put(
    authMiddleware,
    allowRoles("admin", "doctor", "staff"),
    updateHandover
  )
  .delete(
    authMiddleware,
    allowRoles("admin"),
    deleteHandover
  );


module.exports = router;