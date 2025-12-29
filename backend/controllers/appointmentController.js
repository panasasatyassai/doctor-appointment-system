const appointmentModel = require("../models/appointmentModel");
const doctorModel = require("../models/doctorModel")

const bookAppointmentController = async (req, res) => {
  try {
    const { doctor, date, time, problem } = req.body;

    //  const existingAppointment = await appointmentModel.findOne({
    //   patientId: req.user._id,
    //   doctorId: doctor.id,
    //   date: date,
    // });

    // if (existingAppointment) {
    //   return res.status(400).send({
    //     success: false,
    //     message: "You already booked this doctor on the same day",
    //   });
    // }

    const appointment = new appointmentModel({
      patientId: req.user._id,  
      doctorId: doctor.id,
      date,
      time,
      problem,
      status: "approved",
    });

    await appointment.save();

    res.status(201).send({
      success: true,
      message: "Appointment booked successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Failed to book appointment",
    });
  }
};

const getPatientAppointmentsController = async (req, res) => {
  try {
    const appointments = await appointmentModel
      .find({ patientId: req.user._id })
      .populate("doctorId", "name specialization")
      .sort({ createdAt: -1 });
    console.log(appointments);

    res.status(200).send({
      success: true,
      data: appointments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error fetching appointments",
    });
  }
};

 
 

const getDoctorAppointmentsController = async (req, res) => {
  try {
    // 1. find doctor using logged-in user
    const doctor = await doctorModel.findOne({
      userId: req.user._id,
    });

    // 2. if doctor profile not found
    if (!doctor) {
      return res.status(404).send({
        success: false,
        message: "Doctor profile not found",
      });
    }

    // 3. fetch appointments for this doctor
    const appointments = await appointmentModel
      .find({ doctorId: doctor._id })
      .populate("patientId", "name email")
      .sort({ createdAt: -1 });

    // 4. send response
    res.status(200).send({
      success: true,
      data: appointments,
    });
  } catch (error) {
    console.log("getDoctorAppointmentsController error:", error);
    res.status(500).send({
      success: false,
      message: "Failed to fetch doctor appointments",
    });
  }
};

const updateAppointmentController = async (req, res) => {
  try {
    const { date, time } = req.body;
    const appointmentId = req.params.id;

     

    const updated = await appointmentModel.findByIdAndUpdate(
      appointmentId,
      { date, time },
      { new: true }
    );


    if (!updated) {
      return res.status(404).send({
        success: false,
        message: "Appointment not found",
      });
    }

    res.send({
      success: true,
      message: "Appointment updated successfully",
      data: updated,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Update failed",
    });
  }
};


const deleteAppointmentController = async (req, res) => {
  try {
    const appointmentId = req.params.id;

    await appointmentModel.findByIdAndDelete(appointmentId);

    res.send({
      success: true,
      message: "Appointment deleted successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Delete failed",
    });
  }
};


 

const updateAppointmentStatusController = async (req, res) => {
  try {
    const { appointmentId, status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).send({
        success: false,
        message: "Invalid status",
      });
    }

    await appointmentModel.findByIdAndUpdate(appointmentId, {
      status,
    });

    res.status(200).send({
      success: true,
      message: `Appointment ${status}`,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Failed to update appointment",
    });
  }
};

const updateAppointmentStatusController1 = async (req, res) => {
  try {
    const { appointmentId, status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).send({
        success: false,
        message: "Invalid status",
      });
    }

    const appointment = await appointmentModel.findByIdAndUpdate(
      appointmentId,
      { status },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).send({
        success: false,
        message: "Appointment not found",
      });
    }

    res.status(200).send({
      success: true,
      message: `Appointment ${status}`,
      data: appointment,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Failed to update appointment status",
    });
  }
};

module.exports = {
  bookAppointmentController,
  getPatientAppointmentsController,
  getDoctorAppointmentsController,
  updateAppointmentStatusController,
  updateAppointmentController,
  deleteAppointmentController,
  updateAppointmentStatusController1
};
