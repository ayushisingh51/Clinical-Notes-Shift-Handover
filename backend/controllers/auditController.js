const AuditLog = require("../models/AuditLog");
const asyncHandler = require("../utils/asyncHandler");

// Get audit logs
const getAuditLogs = asyncHandler(async (req, res) => {
  const { user, action, resourceType, limit = 50 } = req.query;

  const filter = {};

  if (user) {
    filter.user = user;
  }

  if (action) {
    filter.action = action;
  }

  if (resourceType) {
    filter.resourceType = resourceType;
  }

  const logs = await AuditLog.find(filter)
    .populate("user", "name email role")
    .sort({ createdAt: -1 })
    .limit(Number(limit));

  res.status(200).json({
    success: true,
    count: logs.length,
    logs,
  });
});

// Get audit logs for a specific resource
const getResourceAuditLogs = asyncHandler(async (req, res) => {
  const { resourceType, resourceId } = req.params;

  const logs = await AuditLog.find({
    resourceType,
    resourceId,
  })
    .populate("user", "name email role")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: logs.length,
    logs,
  });
});

module.exports = {
  getAuditLogs,
  getResourceAuditLogs,
};