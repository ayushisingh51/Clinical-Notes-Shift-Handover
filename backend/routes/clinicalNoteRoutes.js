const express = require("express");
const {
  getClinicalNotes,
  getClinicalNoteById,
  createClinicalNote,
  updateClinicalNote,
  deleteClinicalNote,
} = require("../controllers/clinicalNoteController");

const router = express.Router();

router.route("/").get(getClinicalNotes).post(createClinicalNote);
router
  .route("/:id")
  .get(getClinicalNoteById)
  .put(updateClinicalNote)
  .delete(deleteClinicalNote);

module.exports = router;
