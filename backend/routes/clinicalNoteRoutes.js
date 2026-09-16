const express = require("express");

const router = express.Router();

const { uploadAudio } = require("../middleware/uploadMiddleware");

const {
  createNote,
  createVoiceNote,
  getNotesByPatient,
  getNoteById,
  updateNote,
  deleteNote,
  searchNotes,
} = require("../controllers/clinicalNoteController");

const { protect, authorize } = require("../middleware/authMiddleware");

// Search clinical notes
router.get("/search", protect, searchNotes);

// Get all notes for a patient
router.get("/patient/:patientId", protect, getNotesByPatient);

// Temporary audio upload test
router.post(
  "/upload-audio-test",
  protect,
  authorize("Doctor", "Nurse", "Admin"),
  uploadAudio.single("audio"),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No audio file uploaded",
      });
    }

    res.status(200).json({
      success: true,
      message: "Audio uploaded successfully",
      file: {
        originalName: req.file.originalname,
        filename: req.file.filename,
        path: req.file.path,
        mimetype: req.file.mimetype,
        size: req.file.size,
      },
    });
  }
);

router.post(
  "/voice",
  protect,
  authorize("Doctor", "Nurse", "Admin"),
  uploadAudio.single("audio"),
  createVoiceNote
);

// Get one note
router.get("/:id", protect, getNoteById);

// Create a clinical note
router.post(
  "/",
  protect,
  authorize("Doctor", "Nurse", "Admin"),
  createNote
);

// Update a clinical note
router.put(
  "/:id",
  protect,
  authorize("Doctor", "Nurse", "Admin"),
  updateNote
);

// Delete a clinical note
router.delete(
  "/:id",
  protect,
  authorize("Admin"),
  deleteNote
);

module.exports = router;