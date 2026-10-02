const express = require("express");

const {
  getUsers,
  createUser,
  updateUserStatus
} = require("../controllers/userController");

const authMiddleware = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");

const router = express.Router();

// Only Admin can view users
router.get(
  "/",
  authMiddleware,
  allowRoles("admin"),
  getUsers
);

// Only Admin can create users
router.post(
  "/",
  authMiddleware,
  allowRoles("admin"),
  createUser
);

// Only Admin can activate/deactivate users
router.patch(
  "/:id/status",
  authMiddleware,
  allowRoles("admin"),
  updateUserStatus
);

module.exports = router;