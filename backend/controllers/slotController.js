const slotModel = require("../models/slotModel");

const createSlotsController = async (req, res) => {
  try {
    const { date, time } = req.body;

    const slot = new slotModel({
      doctorId: req.user._id,
      date,
      time,
    });

    await slot.save();

    res.status(201).send({
      success: true,
      message: "Slot created",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Slot creation failed",
    });
  }
};

const getDoctorSlotsController = async (req, res) => {
  try {
    const slots = await slotModel.find({
      doctorId: req.user._id,
    });

    res.status(200).send({
      success: true,
      data: slots,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Failed to fetch slots",
    });
  }
};


module.exports = {createSlotsController , getDoctorSlotsController}
