const connectDB = require("./config/db");
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const clinicalNoteRoutes = require("./routes/clinicalNoteRoutes");
const attachmentRoutes = require("./routes/attachmentRoutes");
const taskRoutes = require("./routes/taskRoutes");
const alertRoutes = require("./routes/alertRoutes");
const handoverRoutes = require("./routes/handoverRoutes");
const auditRoutes = require("./routes/auditRoutes");
const errorHandler = require("./middleware/errorMiddleware");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect Database
connectDB();

// Import Routes
const authRoutes = require("./routes/authRoutes");
const patientRoutes = require("./routes/patientRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/clinical-notes", clinicalNoteRoutes);
app.use("/api/attachments", attachmentRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/handovers", handoverRoutes);
app.use("/api/audit-logs", auditRoutes);

// Test Route
app.get("/", (req, res) => {
    res.send("AI Clinical Notes Backend is Running 🚀");
});

app.get("/health", (req, res) => {
    res.json({
        status: "ok",
        message: "Server is healthy",
    });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});