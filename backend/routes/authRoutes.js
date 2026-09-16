const express = require("express");

const router = express.Router();

const {
  registerUser,
  loginUser,
} = require("../controllers/authController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/", (req, res) => {
  res.json({
    message: "Auth Route Working",
  });
});

router.get("/profile", protect, (req, res) => {
  res.json({
    success: true,
    message: "Protected route working",
    user: req.user,
  });
});

router.get(
  "/doctor-only",
  protect,
  authorize("Doctor"),
  (req, res) => {
    res.json({
      success: true,
      message: "Doctor access granted",
      user: req.user,
    });
  }
);

module.exports = router;