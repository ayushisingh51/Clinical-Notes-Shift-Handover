const Patient = require("../models/Patient");
const asyncHandler = require("../utils/asyncHandler");
const { logAction } = require("../utils/auditLogger");

// @route  POST /api/patients
// @access Doctor, Admin
const createPatient = asyncHandler(async (req, res) => {
  const patient = await Patient.create({
    ...req.body,
    createdBy: req.user._id,
  });

  await logAction({
    user: req.user,
    action: "CREATE",
    resourceType: "Patient",
    resourceId: patient._id,
    details: `Created patient ${patient.patientId}`,
    req,
  });

  res.status(201).json({
    success: true,
    patient,
  });
});

// @route  GET /api/patients
// @access Doctor, Nurse, Admin
const getPatients = asyncHandler(async (req, res) => {
  const { status, ward } = req.query;

  const filter = {};

  if (status) filter.status = status;
  if (ward) filter.ward = ward;

  const patients = await Patient.find(filter)
    .populate("assignedDoctors", "name email")
    .populate("assignedNurses", "name email")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: patients.length,
    patients,
  });
});

// @route  GET /api/patients/:id
// @access Doctor, Nurse, Admin
const getPatientById = asyncHandler(async (req, res) => {
  const patient = await Patient.findById(req.params.id)
    .populate("assignedDoctors", "name email")
    .populate("assignedNurses", "name email");

  if (!patient) {
    return res.status(404).json({
      success: false,
      message: "Patient not found",
    });
  }

  await logAction({
    user: req.user,
    action: "READ",
    resourceType: "Patient",
    resourceId: patient._id,
    req,
  });

  res.status(200).json({
    success: true,
    patient,
  });
});

// @route  PUT /api/patients/:id
// @access Doctor, Admin
const updatePatient = asyncHandler(async (req, res) => {
  const patient = await Patient.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!patient) {
    return res.status(404).json({
      success: false,
      message: "Patient not found",
    });
  }

  await logAction({
    user: req.user,
    action: "UPDATE",
    resourceType: "Patient",
    resourceId: patient._id,
    req,
  });

  res.status(200).json({
    success: true,
    patient,
  });
});

// @route  DELETE /api/patients/:id
// @access Admin
const deletePatient = asyncHandler(async (req, res) => {
  const patient = await Patient.findByIdAndDelete(req.params.id);

  if (!patient) {
    return res.status(404).json({
      success: false,
      message: "Patient not found",
    });
  }

  await logAction({
    user: req.user,
    action: "DELETE",
    resourceType: "Patient",
    resourceId: patient._id,
    req,
  });

  res.status(200).json({
    success: true,
    message: "Patient deleted",
  });
});

// @route  GET /api/patients/search?q=...
// @access Doctor, Nurse, Admin
const searchPatients = asyncHandler(async (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({
      success: false,
      message: "Query param 'q' is required",
    });
  }

  const patients = await Patient.find({
    $text: {
      $search: q,
    },
  }).limit(20);

  res.status(200).json({
    success: true,
    count: patients.length,
    patients,
  });
});

module.exports = {
  createPatient,
  getPatients,
  getPatientById,
  updatePatient,
  deletePatient,
  searchPatients,
};