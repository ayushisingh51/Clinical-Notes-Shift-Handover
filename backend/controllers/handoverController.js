const Handover = require("../models/Handover");
const Patient = require("../models/Patient");
const User = require("../models/User");
const Task = require("../models/Task");
const Alert = require("../models/Alert");

const asyncHandler = require("../utils/asyncHandler");
const { logAction } = require("../utils/auditLogger");

// Create a handover
const createHandover = asyncHandler(async (req, res) => {
  const {
    patient,
    outgoingUser,
    incomingUser,
    shift,
    summary,
    importantNotes,
    pendingTasks,
    activeAlerts,
  } = req.body;

  if (
    !patient ||
    !outgoingUser ||
    !incomingUser ||
    !shift ||
    !summary
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Patient, outgoingUser, incomingUser, shift, and summary are required",
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

  // Check outgoing user
  const outgoingExists = await User.findById(outgoingUser);

  if (!outgoingExists) {
    return res.status(404).json({
      success: false,
      message: "Outgoing user not found",
    });
  }

  // Check incoming user
  const incomingExists = await User.findById(incomingUser);

  if (!incomingExists) {
    return res.status(404).json({
      success: false,
      message: "Incoming user not found",
    });
  }

  // Check tasks if provided
  if (pendingTasks && pendingTasks.length > 0) {
    const tasks = await Task.find({
      _id: { $in: pendingTasks },
    });

    if (tasks.length !== pendingTasks.length) {
      return res.status(404).json({
        success: false,
        message: "One or more pending tasks not found",
      });
    }
  }

  // Check alerts if provided
  if (activeAlerts && activeAlerts.length > 0) {
    const alerts = await Alert.find({
      _id: { $in: activeAlerts },
    });

    if (alerts.length !== activeAlerts.length) {
      return res.status(404).json({
        success: false,
        message: "One or more active alerts not found",
      });
    }
  }

  const handover = await Handover.create({
    patient,
    outgoingUser,
    incomingUser,
    shift,
    summary,
    importantNotes: importantNotes || "",
    pendingTasks: pendingTasks || [],
    activeAlerts: activeAlerts || [],
    createdBy: req.user._id,
  });

  await logAction({
    user: req.user,
    action: "CREATE",
    resourceType: "Handover",
    resourceId: handover._id,
    details: `Created handover for patient ${patientExists.patientId}`,
    req,
  });

  res.status(201).json({
    success: true,
    handover,
  });
});

// Get all handovers for a patient
const getHandoversByPatient = asyncHandler(async (req, res) => {
  const { patientId } = req.params;

  const handovers = await Handover.find({
    patient: patientId,
  })
    .populate("outgoingUser", "name email role")
    .populate("incomingUser", "name email role")
    .populate("createdBy", "name email role")
    .populate("pendingTasks", "description priority status dueAt")
    .populate("activeAlerts", "message severity status type")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: handovers.length,
    handovers,
  });
});

// Get one handover
const getHandoverById = asyncHandler(async (req, res) => {
  const handover = await Handover.findById(req.params.id)
    .populate("patient", "patientId name status ward")
    .populate("outgoingUser", "name email role")
    .populate("incomingUser", "name email role")
    .populate("createdBy", "name email role")
    .populate("pendingTasks", "description priority status dueAt")
    .populate("activeAlerts", "message severity status type");

  if (!handover) {
    return res.status(404).json({
      success: false,
      message: "Handover not found",
    });
  }

  await logAction({
    user: req.user,
    action: "READ",
    resourceType: "Handover",
    resourceId: handover._id,
    req,
  });

  res.status(200).json({
    success: true,
    handover,
  });
});

// Update handover
const updateHandover = asyncHandler(async (req, res) => {
  const handover = await Handover.findById(req.params.id);

  if (!handover) {
    return res.status(404).json({
      success: false,
      message: "Handover not found",
    });
  }

  // Only creator, outgoing user, incoming user, or Admin can update
  const isCreator =
    handover.createdBy.toString() === req.user._id.toString();

  const isOutgoing =
    handover.outgoingUser.toString() === req.user._id.toString();

  const isIncoming =
    handover.incomingUser.toString() === req.user._id.toString();

  const isAdmin = req.user.role === "Admin";

  if (!isCreator && !isOutgoing && !isIncoming && !isAdmin) {
    return res.status(403).json({
      success: false,
      message: "You are not authorized to update this handover",
    });
  }

  if (req.body.summary !== undefined) {
    handover.summary = req.body.summary;
  }

  if (req.body.importantNotes !== undefined) {
    handover.importantNotes = req.body.importantNotes;
  }

  if (req.body.shift !== undefined) {
    handover.shift = req.body.shift;
  }

  if (req.body.pendingTasks !== undefined) {
    handover.pendingTasks = req.body.pendingTasks;
  }

  if (req.body.activeAlerts !== undefined) {
    handover.activeAlerts = req.body.activeAlerts;
  }

  if (req.body.status !== undefined) {
    handover.status = req.body.status;
  }

  await handover.save();

  await logAction({
    user: req.user,
    action: "UPDATE",
    resourceType: "Handover",
    resourceId: handover._id,
    req,
  });

  res.status(200).json({
    success: true,
    handover,
  });
});

// Acknowledge handover
const acknowledgeHandover = asyncHandler(async (req, res) => {
  const handover = await Handover.findById(req.params.id);

  if (!handover) {
    return res.status(404).json({
      success: false,
      message: "Handover not found",
    });
  }

  handover.status = "Acknowledged";
  handover.acknowledgedAt = new Date();

  await handover.save();

  await logAction({
    user: req.user,
    action: "ACKNOWLEDGE",
    resourceType: "Handover",
    resourceId: handover._id,
    req,
  });

  res.status(200).json({
    success: true,
    message: "Handover acknowledged",
    handover,
  });
});

// Delete handover
const deleteHandover = asyncHandler(async (req, res) => {
  const handover = await Handover.findByIdAndDelete(req.params.id);

  if (!handover) {
    return res.status(404).json({
      success: false,
      message: "Handover not found",
    });
  }

  await logAction({
    user: req.user,
    action: "DELETE",
    resourceType: "Handover",
    resourceId: handover._id,
    req,
  });

  res.status(200).json({
    success: true,
    message: "Handover deleted",
  });
});

module.exports = {
  createHandover,
  getHandoversByPatient,
  getHandoverById,
  updateHandover,
  acknowledgeHandover,
  deleteHandover,
};