const Task = require("../models/Task");
const Patient = require("../models/Patient");
const User = require("../models/User");
const ClinicalNote = require("../models/ClinicalNote");

const asyncHandler = require("../utils/asyncHandler");
const { logAction } = require("../utils/auditLogger");

// Create a task
const createTask = asyncHandler(async (req, res) => {
  const {
    patient,
    description,
    assignedTo,
    priority,
    dueAt,
    relatedNote,
    source,
  } = req.body;

  if (!patient || !description || !assignedTo) {
    return res.status(400).json({
      success: false,
      message: "Patient, description, and assignedTo are required",
    });
  }

  // Check patient
  const patientExists = await Patient.findById(patient);

  if (!patientExists) {
    return res.status(404).json({
      success: false,
      message: "Patient not found",
    });
  }

  // Check assigned user
  const assignedUser = await User.findById(assignedTo);

  if (!assignedUser) {
    return res.status(404).json({
      success: false,
      message: "Assigned user not found",
    });
  }

  // Check related clinical note if provided
  if (relatedNote) {
    const noteExists = await ClinicalNote.findById(relatedNote);

    if (!noteExists) {
      return res.status(404).json({
        success: false,
        message: "Related clinical note not found",
      });
    }
  }

  const task = await Task.create({
    patient,
    description,
    assignedTo,
    assignedBy: req.user._id,
    priority: priority || "Medium",
    dueAt: dueAt || null,
    relatedNote: relatedNote || null,
    source: source || "Manual",
  });

  await logAction({
    user: req.user,
    action: "CREATE",
    resourceType: "Task",
    resourceId: task._id,
    details: `Created task for patient ${patientExists.patientId}`,
    req,
  });

  res.status(201).json({
    success: true,
    task,
  });
});

// Get all tasks for a patient
const getTasksByPatient = asyncHandler(async (req, res) => {
  const { patientId } = req.params;

  const tasks = await Task.find({
    patient: patientId,
  })
    .populate("assignedTo", "name email role")
    .populate("assignedBy", "name email role")
    .populate("relatedNote", "noteType content createdAt")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: tasks.length,
    tasks,
  });
});

// Get tasks assigned to the logged-in user
const getMyTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.find({
    assignedTo: req.user._id,
  })
    .populate("patient", "patientId name status ward")
    .populate("assignedBy", "name email role")
    .populate("relatedNote", "noteType content createdAt")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: tasks.length,
    tasks,
  });
});

// Get one task
const getTaskById = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id)
    .populate("patient", "patientId name status ward")
    .populate("assignedTo", "name email role")
    .populate("assignedBy", "name email role")
    .populate("relatedNote", "noteType content createdAt");

  if (!task) {
    return res.status(404).json({
      success: false,
      message: "Task not found",
    });
  }

  await logAction({
    user: req.user,
    action: "READ",
    resourceType: "Task",
    resourceId: task._id,
    req,
  });

  res.status(200).json({
    success: true,
    task,
  });
});

// Update task
const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return res.status(404).json({
      success: false,
      message: "Task not found",
    });
  }

  // Only the assigned user, task creator, or Admin can update
  const isAssignedUser =
    task.assignedTo.toString() === req.user._id.toString();

  const isCreator =
    task.assignedBy.toString() === req.user._id.toString();

  const isAdmin = req.user.role === "Admin";

  if (!isAssignedUser && !isCreator && !isAdmin) {
    return res.status(403).json({
      success: false,
      message: "You are not authorized to update this task",
    });
  }

  if (req.body.description !== undefined) {
    task.description = req.body.description;
  }

  if (req.body.priority !== undefined) {
    task.priority = req.body.priority;
  }

  if (req.body.status !== undefined) {
    task.status = req.body.status;
  }

  if (req.body.dueAt !== undefined) {
    task.dueAt = req.body.dueAt;
  }

  await task.save();

  await logAction({
    user: req.user,
    action: "UPDATE",
    resourceType: "Task",
    resourceId: task._id,
    req,
  });

  res.status(200).json({
    success: true,
    task,
  });
});

// Delete task
const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findByIdAndDelete(req.params.id);

  if (!task) {
    return res.status(404).json({
      success: false,
      message: "Task not found",
    });
  }

  await logAction({
    user: req.user,
    action: "DELETE",
    resourceType: "Task",
    resourceId: task._id,
    req,
  });

  res.status(200).json({
    success: true,
    message: "Task deleted",
  });
});

// Search tasks
const searchTasks = asyncHandler(async (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({
      success: false,
      message: "Query param 'q' is required",
    });
  }

  const tasks = await Task.find({
    description: {
      $regex: q,
      $options: "i",
    },
  })
    .populate("patient", "patientId name")
    .populate("assignedTo", "name email role")
    .limit(20);

  res.status(200).json({
    success: true,
    count: tasks.length,
    tasks,
  });
});

module.exports = {
  createTask,
  getTasksByPatient,
  getMyTasks,
  getTaskById,
  updateTask,
  deleteTask,
  searchTasks,
};