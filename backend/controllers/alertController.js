const Alert = require("../models/Alert");
const Patient = require("../models/Patient");
const ClinicalNote = require("../models/ClinicalNote");

const asyncHandler = require("../utils/asyncHandler");
const { logAction } = require("../utils/auditLogger");

// Create an alert
const createAlert = asyncHandler(async (req, res) => {
  const {
    patient,
    clinicalNote,
    message,
    severity,
    type,
  } = req.body;

  if (!patient || !message) {
    return res.status(400).json({
      success: false,
      message: "Patient and message are required",
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

  // Check clinical note if provided
  if (clinicalNote) {
    const noteExists = await ClinicalNote.findById(clinicalNote);

    if (!noteExists) {
      return res.status(404).json({
        success: false,
        message: "Clinical note not found",
      });
    }
  }

  const alert = await Alert.create({
    patient,
    clinicalNote: clinicalNote || null,
    message,
    severity: severity || "High",
    type: type || "Other",
    createdBy: req.user._id,
  });

  await logAction({
    user: req.user,
    action: "CREATE",
    resourceType: "Alert",
    resourceId: alert._id,
    details: `Created alert for patient ${patientExists.patientId}`,
    req,
  });

  res.status(201).json({
    success: true,
    alert,
  });
});

// Get all alerts for a patient
const getAlertsByPatient = asyncHandler(async (req, res) => {
  const { patientId } = req.params;

  const alerts = await Alert.find({
    patient: patientId,
  })
    .populate("createdBy", "name email role")
    .populate("acknowledgedBy", "name email role")
    .populate("resolvedBy", "name email role")
    .populate("clinicalNote", "noteType content createdAt")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: alerts.length,
    alerts,
  });
});

// Get active alerts
const getActiveAlerts = asyncHandler(async (req, res) => {
  const alerts = await Alert.find({
    status: "Active",
  })
    .populate("patient", "patientId name status ward")
    .populate("createdBy", "name email role")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: alerts.length,
    alerts,
  });
});

// Get one alert
const getAlertById = asyncHandler(async (req, res) => {
  const alert = await Alert.findById(req.params.id)
    .populate("patient", "patientId name status ward")
    .populate("createdBy", "name email role")
    .populate("acknowledgedBy", "name email role")
    .populate("resolvedBy", "name email role")
    .populate("clinicalNote", "noteType content");

  if (!alert) {
    return res.status(404).json({
      success: false,
      message: "Alert not found",
    });
  }

  await logAction({
    user: req.user,
    action: "READ",
    resourceType: "Alert",
    resourceId: alert._id,
    req,
  });

  res.status(200).json({
    success: true,
    alert,
  });
});

// Acknowledge an alert
const acknowledgeAlert = asyncHandler(async (req, res) => {
  const alert = await Alert.findById(req.params.id);

  if (!alert) {
    return res.status(404).json({
      success: false,
      message: "Alert not found",
    });
  }

  if (alert.status === "Resolved") {
    return res.status(400).json({
      success: false,
      message: "Resolved alert cannot be acknowledged",
    });
  }

  alert.status = "Acknowledged";
  alert.acknowledgedBy = req.user._id;
  alert.acknowledgedAt = new Date();

  await alert.save();

  await logAction({
    user: req.user,
    action: "ACKNOWLEDGE",
    resourceType: "Alert",
    resourceId: alert._id,
    req,
  });

  res.status(200).json({
    success: true,
    message: "Alert acknowledged",
    alert,
  });
});

// Resolve an alert
const resolveAlert = asyncHandler(async (req, res) => {
  const alert = await Alert.findById(req.params.id);

  if (!alert) {
    return res.status(404).json({
      success: false,
      message: "Alert not found",
    });
  }

  alert.status = "Resolved";
  alert.resolvedBy = req.user._id;
  alert.resolvedAt = new Date();

  await alert.save();

  await logAction({
    user: req.user,
    action: "RESOLVE",
    resourceType: "Alert",
    resourceId: alert._id,
    req,
  });

  res.status(200).json({
    success: true,
    message: "Alert resolved",
    alert,
  });
});

// Delete an alert
const deleteAlert = asyncHandler(async (req, res) => {
  const alert = await Alert.findByIdAndDelete(req.params.id);

  if (!alert) {
    return res.status(404).json({
      success: false,
      message: "Alert not found",
    });
  }

  await logAction({
    user: req.user,
    action: "DELETE",
    resourceType: "Alert",
    resourceId: alert._id,
    req,
  });

  res.status(200).json({
    success: true,
    message: "Alert deleted",
  });
});

module.exports = {
  createAlert,
  getAlertsByPatient,
  getActiveAlerts,
  getAlertById,
  acknowledgeAlert,
  resolveAlert,
  deleteAlert,
};