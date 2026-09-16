const AuditLog = require("../models/AuditLog");

const logAction = async ({
  user,
  action,
  resourceType,
  resourceId,
  details = "",
  req,
}) => {
  try {
    await AuditLog.create({
      user: user?._id,
      action,
      resourceType,
      resourceId,
      details,
      ipAddress: req?.ip || "",
      userAgent: req?.headers?.["user-agent"] || "",
    });
  } catch (error) {
    console.error("Audit log failed:", error.message);
  }
};

module.exports = {
  logAction,
};