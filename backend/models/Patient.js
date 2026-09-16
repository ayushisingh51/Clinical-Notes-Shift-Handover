const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
  {
    patientId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["Admitted", "Discharged", "Critical", "Stable"],
      default: "Admitted",
    },

    ward: {
      type: String,
      trim: true,
    },

    assignedDoctors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    assignedNurses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Text search for patient name, ID and ward
patientSchema.index({
  name: "text",
  patientId: "text",
  ward: "text",
});

module.exports = mongoose.model("Patient", patientSchema);