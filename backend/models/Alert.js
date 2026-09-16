const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema(
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

    message: {
      type: String,
      required: true,
      trim: true,
    },

    severity: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
      default: "High",
    },

    type: {
      type: String,
      enum: [
        "Vital Signs",
        "Medication",
        "Patient Condition",
        "Lab Report",
        "AI Detected",
        "Other",
      ],
      default: "Other",
    },

    status: {
      type: String,
      enum: ["Active", "Acknowledged", "Resolved"],
      default: "Active",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    acknowledgedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    acknowledgedAt: {
      type: Date,
      default: null,
    },

    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    resolvedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Alert", alertSchema);