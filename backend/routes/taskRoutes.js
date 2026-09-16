const express = require("express");

const router = express.Router();

const {
  createTask,
  getTasksByPatient,
  getMyTasks,
  getTaskById,
  updateTask,
  deleteTask,
  searchTasks,
} = require("../controllers/taskController");

const { protect, authorize } = require("../middleware/authMiddleware");

// Search tasks
router.get("/search", protect, searchTasks);

// Get tasks assigned to logged-in user
router.get("/my", protect, getMyTasks);

// Get all tasks for a patient
router.get(
  "/patient/:patientId",
  protect,
  getTasksByPatient
);

// Get one task
router.get("/:id", protect, getTaskById);

// Create task
router.post(
  "/",
  protect,
  authorize("Doctor", "Nurse", "Admin"),
  createTask
);

// Update task
router.put(
  "/:id",
  protect,
  authorize("Doctor", "Nurse", "Admin"),
  updateTask
);

// Delete task
router.delete(
  "/:id",
  protect,
  authorize("Admin"),
  deleteTask
);

module.exports = router;