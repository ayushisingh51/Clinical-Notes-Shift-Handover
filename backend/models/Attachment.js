const mongoose = require("mongoose");

const attachmentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },

    clinicalNote: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ClinicalNote",
      default: null,
    },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    originalName: {
      type: String,
      required: true,
    },

    fileName: {
      type: String,
      required: true,
    },

    filePath: {
      type: String,
      required: true,
    },

    mimeType: {
      type: String,
      required: true,
    },

    fileSize: {
      type: Number,
      required: true,
    },

    fileType: {
      type: String,
      enum: [
        "Report",
        "X-Ray",
        "ECG",
        "MRI",
        "PDF",
        "Other",
      ],
      default: "Other",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Attachment", attachmentSchema);