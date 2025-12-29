const appointmentModel = require("../models/appointmentModel");
const doctorModel = require("../models/doctorModel");

const getAllAppointmentsController = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({}).populate("patientId", "name email").populate("doctorId", "name specialization").sort({ createdAt: -1 });

    
    res.status(200).send({
      success: true,
      data: appointments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Failed to fetch appointments",
    });
  }
};

const updateDoctorStatusController = async (req, res) => {
  try {
    const { doctorId, status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).send({
        success: false,
        message: "Invalid status",
      });
    }

    const doctor = await doctorModel.findByIdAndUpdate(
      doctorId,
      { status },
      { new: true }
    );

    if (!doctor) {
      return res.status(404).send({
        success: false,
        message: "Doctor not found",
      });
    }

    res.status(200).send({
      success: true,
      message: `Doctor ${status} successfully`,
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Failed to update doctor status",
    });
  }
};




module.exports = {getAllAppointmentsController , updateDoctorStatusController}