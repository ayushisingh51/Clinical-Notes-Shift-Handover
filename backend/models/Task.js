const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Urgent"],
      default: "Medium",
    },

    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed", "Cancelled"],
      default: "Pending",
    },

    dueAt: {
      type: Date,
      default: null,
    },

    relatedNote: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ClinicalNote",
      default: null,
    },

    source: {
      type: String,
      enum: ["Manual", "AI"],
      default: "Manual",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Task", taskSchema);