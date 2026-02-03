const appointmentModel = require("../models/appointmentModel");
const doctorModel = require("../models/doctorModel");
const sendMail = require("../utils/sendEmail");

const getAllAppointmentsController = async (req, res) => {
  try {
    const appointments = await appointmentModel
      .find({})
      .populate("patientId", "name email")
      .populate("doctorId", "name specialization")
      .sort({ createdAt: -1 });

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
      { new: true },
    );

    if (!doctor) {
      return res.status(404).send({
        success: false,
        message: "Doctor not found",
      });
    }

    if (status === "rejected") {
      const today = new Date().toISOString().split("T")[0];

      const appointments = await appointmentModel
        .find({
          doctorId,
          date: { $gte: today },
          status: "approved",
        })
        .populate("patientId", "email name");
      console.log("all : ", appointments);

      for (const appt of appointments) {
        appt.status = "cancelled";
        appt.cancelReason = "Doctor rejected by admin";
        await appt.save();

        await sendMail({
          to: appt.patientId.email,
          subject: "Appointment Cancelled",
          html: `
            <p>Dear <b>${appt.patientId.name}</b>,</p>
            <p>Your appointment with <b>Dr. ${doctor.name}</b> on 
            <b>${appt.date} at ${appt.time}</b> has been <b>cancelled</b>.</p>
            <p><b>Reason:</b> Doctor is no longer available.</p>
            <br/>
            <p>Please book another appointment.</p>
            <p>– Doccure Team</p>
          `,
        });
      }
    }

    res.status(200).send({
      success: true,
      message: `Doctor ${status} successfully`,
    });
    console.log("ok");
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Failed to update doctor status",
    });
  }
};




module.exports = {getAllAppointmentsController , updateDoctorStatusController}