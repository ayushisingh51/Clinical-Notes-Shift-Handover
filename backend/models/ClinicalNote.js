const mongoose = require("mongoose");

const clinicalNoteSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: [true, "Patient reference is required"],
    },
    author: {
      type: String,
      required: [true, "Author is required"],
      trim: true,
    },
    noteType: {
      type: String,
      required: [true, "Note type is required"],
      enum: ["Progress", "Assessment", "Observation", "Discharge", "Other"],
      trim: true,
    },
    content: {
      type: String,
      required: [true, "Note content is required"],
      trim: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ClinicalNote", clinicalNoteSchema);
