const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const patientRoutes = require("./routes/patientRoutes");
const clinicalNoteRoutes = require("./routes/clinicalNoteRoutes");
const shiftHandoverRoutes = require("./routes/shiftHandoverRoutes");

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test Route
app.get("/", (req, res) => {
  res.send("AI Clinical Notes Backend is Running 🚀");
});

app.use("/api/patients", patientRoutes);
app.use("/api/clinical-notes", clinicalNoteRoutes);
app.use("/api/handovers", shiftHandoverRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((error, req, res, next) => {
  if (error.name === "ValidationError") {
    return res.status(400).json({
      message: "Validation failed",
      errors: Object.values(error.errors).map((item) => item.message),
    });
  }

  if (error.name === "CastError") {
    return res.status(400).json({ message: "Invalid resource ID" });
  }

  if (error.code === 11000) {
    return res.status(409).json({ message: "A record with that value already exists" });
  }

  console.error("API error:", error.message);
  res.status(500).json({ message: "Internal server error" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});