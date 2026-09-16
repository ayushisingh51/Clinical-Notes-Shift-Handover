const mongoose = require("mongoose");

const clinicalNoteSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    authorRole: {
      type: String,
      enum: ["Doctor", "Nurse", "Admin"],
      required: true,
    },

    noteType: {
      type: String,
      enum: [
        "Progress",
        "Diagnosis",
        "Treatment",
        "Observation",
        "Nursing",
        "Discharge",
        "Other",
      ],
      default: "Progress",
    },

    shift: {
      type: String,
      enum: ["Morning", "Evening", "Night", ""],
      default: "",
    },

    tags: [
      {
        type: String,
        trim: true,
      },
    ],

    content: {
      type: String,
      required: true,
      trim: true,
    },

    inputMethod: {
      type: String,
      enum: ["Text", "Voice"],
      default: "Text",
    },

    audioUrl: {
      type: String,
      default: "",
    },

    aiSummary: {
      type: String,
      default: "",
    },

    isCritical: {
      type: Boolean,
      default: false,
    },

    editHistory: [
      {
        editedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },

        previousContent: {
          type: String,
        },

        editedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Allows searching through clinical note content
clinicalNoteSchema.index({
  content: "text",
  tags: "text",
});

module.exports = mongoose.model("ClinicalNote", clinicalNoteSchema);