const express = require("express");
const {
  getHandovers,
  getHandoverById,
  createHandover,
  updateHandover,
  deleteHandover,
} = require("../controllers/shiftHandoverController");

const router = express.Router();

router.route("/").get(getHandovers).post(createHandover);
router
  .route("/:id")
  .get(getHandoverById)
  .put(updateHandover)
  .delete(deleteHandover);

module.exports = router;
