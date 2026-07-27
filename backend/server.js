/*const connectDB = require("./config/db");
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
//const authRoutes = require("./routes/authRoutes");
//console.log("authRoutes =", authRoutes);

dotenv.config();

connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());


//app.use("/api/auth", authRoutes);

// Test Route
app.get("/", (req, res) => {
    res.send("AI Clinical Notes Backend is Running 🚀");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});*/
const connectDB = require("./config/db");
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect Database
connectDB();

// Import Routes
const authRoutes = require("./routes/authRoutes");

// Debug
console.log("Type of authRoutes:", typeof authRoutes);
console.log("authRoutes =", authRoutes);

// Comment this for now while debugging
// app.use("/api/auth", authRoutes);

// Test Route
app.get("/", (req, res) => {
    res.send("AI Clinical Notes Backend is Running 🚀");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});