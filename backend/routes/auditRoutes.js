const express = require("express");

const router = express.Router();

const {
  getAuditLogs,
  getResourceAuditLogs,
} = require("../controllers/auditController");

const { protect, authorize } = require("../middleware/authMiddleware");

// Get audit logs with optional filters
router.get(
  "/",
  protect,
  authorize("Admin"),
  getAuditLogs
);

// Get audit history for a specific resource
router.get(
  "/resource/:resourceType/:resourceId",
  protect,
  authorize("Admin"),
  getResourceAuditLogs
);

module.exports = router;