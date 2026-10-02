const express = require("express");

const {
  registerUser,
  loginUser,
  setupFirstAdmin
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");

const router = express.Router();


// ===============================
// REGISTER
// ===============================
router.post("/register", registerUser);


// ===============================
// LOGIN
// ===============================
router.post("/login", loginUser);

// ===============================
// INITIAL ADMIN SETUP
// ===============================
router.post("/setup-first-admin", setupFirstAdmin);

// ===============================
// TEST AUTHENTICATION
// ===============================
router.get("/me", authMiddleware, (req, res) => {
  res.status(200).json({
    message: "Authentication successful",
    user: req.user
  });
});


// ===============================
// TEST ROLE AUTHORIZATION
// ===============================
router.get(
  "/admin-test",
  authMiddleware,
  allowRoles("admin"),
  (req, res) => {
    res.status(200).json({
      message: "Admin access granted",
      user: req.user
    });
  }
);


module.exports = router;