const ShiftHandover = require("../models/ShiftHandover");

const getHandovers = async (req, res, next) => {
  try {
    const handovers = await ShiftHandover.find()
      .populate("patient", "patientId name")
      .sort({ timestamp: -1 });
    res.json(handovers);
  } catch (error) {
    next(error);
  }
};

const getHandoverById = async (req, res, next) => {
  try {
    const handover = await ShiftHandover.findById(req.params.id).populate(
      "patient",
      "patientId name"
    );

    if (!handover) {
      return res.status(404).json({ message: "Shift handover not found" });
    }

    res.json(handover);
  } catch (error) {
    next(error);
  }
};

const createHandover = async (req, res, next) => {
  try {
    const handover = await ShiftHandover.create(req.body);
    const populatedHandover = await handover.populate("patient", "patientId name");
    res.status(201).json(populatedHandover);
  } catch (error) {
    next(error);
  }
};

const updateHandover = async (req, res, next) => {
  try {
    const handover = await ShiftHandover.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    ).populate("patient", "patientId name");

    if (!handover) {
      return res.status(404).json({ message: "Shift handover not found" });
    }

    res.json(handover);
  } catch (error) {
    next(error);
  }
};

const deleteHandover = async (req, res, next) => {
  try {
    const handover = await ShiftHandover.findByIdAndDelete(req.params.id);

    if (!handover) {
      return res.status(404).json({ message: "Shift handover not found" });
    }

    res.json({ message: "Shift handover deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getHandovers,
  getHandoverById,
  createHandover,
  updateHandover,
  deleteHandover,
};
