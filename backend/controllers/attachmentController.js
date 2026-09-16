const Attachment = require("../models/Attachment");
const Patient = require("../models/Patient");
const ClinicalNote = require("../models/ClinicalNote");

const asyncHandler = require("../utils/asyncHandler");
const { logAction } = require("../utils/auditLogger");

// Upload attachment
const uploadAttachment = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "File is required",
    });
  }

  const {
    patient,
    clinicalNote,
    fileType,
  } = req.body;

  if (!patient) {
    return res.status(400).json({
      success: false,
      message: "Patient is required",
    });
  }

  // Check patient exists
  const patientExists = await Patient.findById(patient);

  if (!patientExists) {
    return res.status(404).json({
      success: false,
      message: "Patient not found",
    });
  }

  // If a clinical note was provided, verify it exists
  if (clinicalNote) {
    const noteExists = await ClinicalNote.findById(clinicalNote);

    if (!noteExists) {
      return res.status(404).json({
        success: false,
        message: "Clinical note not found",
      });
    }
  }

  const attachment = await Attachment.create({
    patient,
    clinicalNote: clinicalNote || null,
    uploadedBy: req.user._id,

    originalName: req.file.originalname,
    fileName: req.file.filename,
    filePath: `/uploads/attachments/${req.file.filename}`,
    mimeType: req.file.mimetype,
    fileSize: req.file.size,

    fileType: fileType || "Other",
  });

  await logAction({
    user: req.user,
    action: "CREATE",
    resourceType: "Attachment",
    resourceId: attachment._id,
    details: `Uploaded attachment ${req.file.originalname} for patient ${patientExists.patientId}`,
    req,
  });

  res.status(201).json({
    success: true,
    attachment,
  });
});

// Get all attachments for a patient
const getAttachmentsByPatient = asyncHandler(async (req, res) => {
  const { patientId } = req.params;

  const attachments = await Attachment.find({
    patient: patientId,
  })
    .populate("uploadedBy", "name email role")
    .populate("clinicalNote", "noteType content createdAt")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: attachments.length,
    attachments,
  });
});

// Get one attachment
const getAttachmentById = asyncHandler(async (req, res) => {
  const attachment = await Attachment.findById(req.params.id)
    .populate("uploadedBy", "name email role")
    .populate("patient", "patientId name")
    .populate("clinicalNote", "noteType content");

  if (!attachment) {
    return res.status(404).json({
      success: false,
      message: "Attachment not found",
    });
  }

  await logAction({
    user: req.user,
    action: "READ",
    resourceType: "Attachment",
    resourceId: attachment._id,
    req,
  });

  res.status(200).json({
    success: true,
    attachment,
  });
});

// Delete attachment
const deleteAttachment = asyncHandler(async (req, res) => {
  const attachment = await Attachment.findByIdAndDelete(req.params.id);

  if (!attachment) {
    return res.status(404).json({
      success: false,
      message: "Attachment not found",
    });
  }

  await logAction({
    user: req.user,
    action: "DELETE",
    resourceType: "Attachment",
    resourceId: attachment._id,
    req,
  });

  res.status(200).json({
    success: true,
    message: "Attachment deleted",
  });
});

module.exports = {
  uploadAttachment,
  getAttachmentsByPatient,
  getAttachmentById,
  deleteAttachment,
};