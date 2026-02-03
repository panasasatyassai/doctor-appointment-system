const doctorModel = require("../models/doctorModel");


const getDoctorProfileController = async (req, res) => {
  try {
     
    const doctor = await doctorModel.findOne({ userId: req.user._id }).select(
      "name email"
    );

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor profile not found",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        name: doctor.name,
        email: doctor.email,
      },
    });
  } catch (error) {
    console.error("Get Doctor Profile Error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching doctor profile",
    });
  }
};

module.exports = {
  getDoctorProfileController,
};
