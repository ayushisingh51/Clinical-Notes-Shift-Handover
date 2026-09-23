const ClinicalNote = require("../models/ClinicalNote");

const getClinicalNotes = async (req, res, next) => {
  try {
    const notes = await ClinicalNote.find()
      .populate("patient", "patientId name")
      .sort({ timestamp: -1 });
    res.json(notes);
  } catch (error) {
    next(error);
  }
};

const getClinicalNoteById = async (req, res, next) => {
  try {
    const note = await ClinicalNote.findById(req.params.id).populate(
      "patient",
      "patientId name"
    );

    if (!note) {
      return res.status(404).json({ message: "Clinical note not found" });
    }

    res.json(note);
  } catch (error) {
    next(error);
  }
};

const createClinicalNote = async (req, res, next) => {
  try {
    const note = await ClinicalNote.create(req.body);
    const populatedNote = await note.populate("patient", "patientId name");
    res.status(201).json(populatedNote);
  } catch (error) {
    next(error);
  }
};

const updateClinicalNote = async (req, res, next) => {
  try {
    const note = await ClinicalNote.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    ).populate("patient", "patientId name");

    if (!note) {
      return res.status(404).json({ message: "Clinical note not found" });
    }

    res.json(note);
  } catch (error) {
    next(error);
  }
};

const deleteClinicalNote = async (req, res, next) => {
  try {
    const note = await ClinicalNote.findByIdAndDelete(req.params.id);

    if (!note) {
      return res.status(404).json({ message: "Clinical note not found" });
    }

    res.json({ message: "Clinical note deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getClinicalNotes,
  getClinicalNoteById,
  createClinicalNote,
  updateClinicalNote,
  deleteClinicalNote,
};
