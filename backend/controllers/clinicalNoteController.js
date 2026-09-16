const ClinicalNote = require("../models/ClinicalNote");
const Patient = require("../models/Patient");
const asyncHandler = require("../utils/asyncHandler");
const { logAction } = require("../utils/auditLogger");
const transcriptionService = require("../services/transcriptionService");

// Create a text clinical note
const createNote = asyncHandler(async (req, res) => {
  const {
    patient,
    noteType,
    shift,
    tags,
    content,
  } = req.body;

  if (!patient || !content) {
    return res.status(400).json({
      success: false,
      message: "Patient and content are required",
    });
  }

  const patientExists = await Patient.findById(patient);

  if (!patientExists) {
    return res.status(404).json({
      success: false,
      message: "Patient not found",
    });
  }

  const clinicalNote = await ClinicalNote.create({
    patient,
    author: req.user._id,
    authorRole: req.user.role,
    noteType: noteType || "Progress",
    shift: shift || "",
    tags: tags || [],
    content,
    inputMethod: "Text",
  });

  await logAction({
    user: req.user,
    action: "CREATE",
    resourceType: "ClinicalNote",
    resourceId: clinicalNote._id,
    details: `Created clinical note for patient ${patientExists.patientId}`,
    req,
  });

  res.status(201).json({
    success: true,
    clinicalNote,
  });
});

// Create a voice clinical note
const createVoiceNote = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "Audio file is required",
    });
  }

  const {
    patient,
    noteType,
    shift,
    tags,
  } = req.body;

  if (!patient) {
    return res.status(400).json({
      success: false,
      message: "Patient is required",
    });
  }

  const patientExists = await Patient.findById(patient);

  if (!patientExists) {
    return res.status(404).json({
      success: false,
      message: "Patient not found",
    });
  }

  // Send audio to transcription service
  const transcript = await transcriptionService.transcribeAudio(
    req.file.path
  );

  const audioUrl = `/uploads/audio/${req.file.filename}`;

  const clinicalNote = await ClinicalNote.create({
    patient,
    author: req.user._id,
    authorRole: req.user.role,
    noteType: noteType || "Progress",
    shift: shift || "",
    tags: tags || [],
    content: transcript,
    inputMethod: "Voice",
    audioUrl,
  });

  await logAction({
    user: req.user,
    action: "CREATE",
    resourceType: "ClinicalNote",
    resourceId: clinicalNote._id,
    details: `Created voice clinical note for patient ${patientExists.patientId}`,
    req,
  });

  res.status(201).json({
    success: true,
    clinicalNote,
  });
});

// Get all notes for a patient
const getNotesByPatient = asyncHandler(async (req, res) => {
  const { patientId } = req.params;

  const notes = await ClinicalNote.find({
    patient: patientId,
  })
    .populate("author", "name email role")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: notes.length,
    notes,
  });
});

// Get one clinical note
const getNoteById = asyncHandler(async (req, res) => {
  const note = await ClinicalNote.findById(req.params.id)
    .populate("author", "name email role")
    .populate("patient", "patientId name status ward");

  if (!note) {
    return res.status(404).json({
      success: false,
      message: "Clinical note not found",
    });
  }

  await logAction({
    user: req.user,
    action: "READ",
    resourceType: "ClinicalNote",
    resourceId: note._id,
    req,
  });

  res.status(200).json({
    success: true,
    note,
  });
});

// Update clinical note
const updateNote = asyncHandler(async (req, res) => {
  const note = await ClinicalNote.findById(req.params.id);

  if (!note) {
    return res.status(404).json({
      success: false,
      message: "Clinical note not found",
    });
  }

  // Only author or Admin can edit
  if (
    note.author.toString() !== req.user._id.toString() &&
    req.user.role !== "Admin"
  ) {
    return res.status(403).json({
      success: false,
      message: "You are not authorized to edit this note",
    });
  }

  // Store previous content
  if (req.body.content && req.body.content !== note.content) {
    note.editHistory = note.editHistory || [];

    note.editHistory.push({
      editedBy: req.user._id,
      previousContent: note.content,
      editedAt: new Date(),
    });

    note.content = req.body.content;
  }

  if (req.body.tags !== undefined) {
    note.tags = req.body.tags;
  }

  if (req.body.noteType !== undefined) {
    note.noteType = req.body.noteType;
  }

  if (req.body.shift !== undefined) {
    note.shift = req.body.shift;
  }

  await note.save();

  await logAction({
    user: req.user,
    action: "UPDATE",
    resourceType: "ClinicalNote",
    resourceId: note._id,
    req,
  });

  res.status(200).json({
    success: true,
    note,
  });
});

// Delete clinical note
const deleteNote = asyncHandler(async (req, res) => {
  const note = await ClinicalNote.findByIdAndDelete(req.params.id);

  if (!note) {
    return res.status(404).json({
      success: false,
      message: "Clinical note not found",
    });
  }

  await logAction({
    user: req.user,
    action: "DELETE",
    resourceType: "ClinicalNote",
    resourceId: note._id,
    req,
  });

  res.status(200).json({
    success: true,
    message: "Clinical note deleted",
  });
});

// Search clinical notes
const searchNotes = asyncHandler(async (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({
      success: false,
      message: "Query param 'q' is required",
    });
  }

  const notes = await ClinicalNote.find({
    $text: {
      $search: q,
    },
  })
    .populate("author", "name email role")
    .populate("patient", "patientId name")
    .limit(20);

  res.status(200).json({
    success: true,
    count: notes.length,
    notes,
  });
});

module.exports = {
  createNote,
  createVoiceNote,
  getNotesByPatient,
  getNoteById,
  updateNote,
  deleteNote,
  searchNotes,
};