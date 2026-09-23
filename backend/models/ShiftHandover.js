const mongoose = require("mongoose");

const shiftHandoverSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
    },
    shift: {
      type: String,
      required: [true, "Shift is required"],
      trim: true,
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Urgent"],
      default: "Medium",
    },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed"],
      default: "Pending",
    },
    observations: {
      type: String,
      trim: true,
    },
    pendingTasks: [
      {
        type: String,
        trim: true,
      },
    ],
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ShiftHandover", shiftHandoverSchema);
