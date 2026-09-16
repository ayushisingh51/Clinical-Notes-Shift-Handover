const express = require("express");

const router = express.Router();

const {
  uploadAttachment,
  getAttachmentsByPatient,
  getAttachmentById,
  deleteAttachment,
} = require("../controllers/attachmentController");

const { protect, authorize } = require("../middleware/authMiddleware");

const {
  uploadAttachment: uploadFile,
} = require("../middleware/attachmentMiddleware");

// Get all attachments for a patient
router.get(
  "/patient/:patientId",
  protect,
  getAttachmentsByPatient
);

// Get one attachment
router.get(
  "/:id",
  protect,
  getAttachmentById
);

// Upload attachment
router.post(
  "/",
  protect,
  authorize("Doctor", "Nurse", "Admin"),
  uploadFile.single("file"),
  uploadAttachment
);

// Delete attachment
router.delete(
  "/:id",
  protect,
  authorize("Admin"),
  deleteAttachment
);

module.exports = router;