const mongoose = require("mongoose");

const handoverSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },

    outgoingUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    incomingUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    shift: {
      type: String,
      enum: ["Morning", "Evening", "Night"],
      required: true,
    },

    summary: {
      type: String,
      required: true,
      trim: true,
    },

    importantNotes: {
      type: String,
      default: "",
      trim: true,
    },

    pendingTasks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
      },
    ],

    activeAlerts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Alert",
      },
    ],

    status: {
      type: String,
      enum: ["Draft", "Completed", "Acknowledged"],
      default: "Draft",
    },

    aiSummary: {
      type: String,
      default: "",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    acknowledgedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Handover", handoverSchema);