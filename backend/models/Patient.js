const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
  {
    patientId: {
      type: String,
      required: [true, "Patient ID is required"],
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, "Patient name is required"],
      trim: true,
    },
    age: {
      type: Number,
      min: [0, "Age cannot be negative"],
      max: [130, "Age must be 130 or less"],
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other", "Prefer not to say"],
      trim: true,
    },
    contact: {
      phone: {
        type: String,
        trim: true,
      },
      email: {
        type: String,
        trim: true,
        lowercase: true,
      },
    },
    admissionDate: {
      type: Date,
    },
    admissionReason: {
      type: String,
      trim: true,
    },
    condition: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["Stable", "Attention", "Critical", "Discharged"],
      default: "Stable",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Patient", patientSchema);
