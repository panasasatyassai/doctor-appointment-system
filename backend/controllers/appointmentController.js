const appointmentModel = require("../models/appointmentModel");
const doctorModel = require("../models/doctorModel");
const nodeMailer = require("nodemailer");

const bookAppointmentController = async (req, res) => {
  try {
    const { doctor, date, time, problem } = req.body;

    console.log(doctor, date);

    const existingAppointment = await appointmentModel.findOne({
      doctorId: doctor.id,
      patientId: req.user._id,
      date,
      status: { $ne: "rejected" },
    });

    if (existingAppointment) {
      return res.status(500).send({
        success: false,
        message:
          "This time slot is already booked. Please choose another time.",
      });
    }

    const appointment = new appointmentModel({
      patientId: req.user._id,
      doctorId: doctor.id,
      date,
      time,
      problem,
      status: "pending",
    });

    await appointment.save();

    res.status(201).send({
      success: true,
      message: "Appointment request sent. Waiting for doctor approval.",
    });
  } catch (error) {
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

    res.status(200).send({
      success: true,
      data: appointments,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error fetching appointments",
    });
  }
};

const getDoctorAppointmentsController = async (req, res) => {
  try {
    const doctor = await doctorModel.findOne({
      userId: req.user._id,
    });

    if (!doctor) {
      return res.status(404).send({
        success: false,
        message: "Doctor profile not found",
      });
    }

    const appointments = await appointmentModel
      .find({ doctorId: doctor._id })
      .populate("patientId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      data: appointments,
    });
  } catch (error) {
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
      { new: true },
    );

    if (!updated) {
      return res.status(404).send({
        success: false,
        message: "Appointment not found",
      });
    }

    res.status(200).send({
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

const updateAppointmentStatusController1 = async (req, res) => {
  try {
    const { appointmentId, status } = req.body;

    console.log(status);

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).send({
        success: false,
        message: "Invalid status",
      });
    }

    // const appointment = await appointmentModel
    //   .findByIdAndUpdate(appointmentId, { status }, { new: true })
    //   .populate("patientId", "name email")
    //   .populate("doctorId", "name");

    const appointment = await appointmentModel
      .findByIdAndUpdate(appointmentId, { status }, { new: true })
      .populate("patientId", "name email")
      .populate({
        path: "doctorId",
        select: "name userId",
        populate: {
          path: "userId",
          select: "email",
        },
      });

    const doctorEmail = appointment.doctorId.userId.email;
    console.log(appointment);

    if (!appointment) {
      return res.status(404).send({
        success: false,
        message: "Appointment not found",
      });
    }

    const convertToAmPm = (time24) => {
      let [hours, minutes] = time24.split(":");
      hours = Number(hours);
      const period = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12;
      return `${hours}:${minutes} ${period}`;
    };

    const transporter = nodeMailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL,
        pass: process.env.PASS,
      },
      tls: { rejectUnauthorized: false },
    });

    if (status === "approved") {
      await transporter.sendMail({
        from: process.env.GMAIL,
        to: appointment.patientId.email,
        subject: `Appointment Approved with ${appointment.doctorId.name}`,
        html: `
          <h2>Your Appointment is Confirmed</h2>
          <ul>
            <li><b>Patient Name:</b> ${appointment.patientId.name}</li>
            <li><b>Doctor Name:</b> ${appointment.doctorId.name}</li>
            <li><b>Date:</b> ${appointment.date}</li>
            <li><b>Time:</b> ${convertToAmPm(appointment.time)}</li>
          </ul>
        `,
      });

      await transporter.sendMail({
        from: process.env.GMAIL,
        to: doctorEmail,
        subject: `You Approved an appointment`,
        html: `
         <h2>Appointment approved</h2>
         <ul>
         <li><b>Patient : </b>${appointment.patientId.name} </li>
         <li><b>Problem : </b>${appointment.problem} </li>
         <li><b>Date : </b>${appointment.date} </li>
         <li><b>Time : </b>${convertToAmPm(appointment.time)}</li>
         </ul>
        `,
      });
      //console.log("okk");
    }

    if (status === "rejected") {
      await transporter.sendMail({
        from: process.env.GMAIL,
        to: appointment.patientId.email,
        subject: `Appointment Rejected with ${appointment.doctorId.name}`,
        html: `
          <h2>Your Appointment has been Rejected</h2>
          <ul>
            <li><b>Patient Name:</b> ${appointment.patientId.name}</li>
            <li><b>Doctor Name:</b> ${appointment.doctorId.name}</li>
            <li><b>Date:</b> ${appointment.date}</li>
            <li><b>Time:</b> ${convertToAmPm(appointment.time)}</li>
          </ul>
          <p>Please try booking another slot or doctor.</p>
        `,
      });

      await transporter.sendMail({
        from: process.env.GMAIL,
        to: doctorEmail,
        subject: "You rejected an appointment",
        html: `
        <h2>Appointment Rejected </h2> 
        <ul>
        <li><b>Patient : </b>${appointment.patientId.name} </li> 
        <li><b>Problem : </b>${appointment.problem} </li>
        <li><b>Date : </b>${appointment.date} </li> 
        <li><b>Time:</b> ${convertToAmPm(appointment.time)}</li>
          </ul>
        `,
      });
    }

    res.status(200).send({
      success: true,
      message: `Appointment ${status}`,
      data: appointment,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Failed to update appointment status",
    });
  }
};

// const updateAppointmentStatusController1 = async (req, res) => {
//   try {
//     const { appointmentId, status } = req.body;

//     if (!["approved", "rejected"].includes(status)) {
//       return res.status(400).send({
//         success: false,
//         message: "Invalid status",
//       });
//     }

//     const appointment = await appointmentModel
//       .findByIdAndUpdate(appointmentId, { status }, { new: true })
//       .populate("patientId", "name email")
//       .populate("doctorId", "name email"); // IMPORTANT

//     if (!appointment) {
//       return res.status(404).send({
//         success: false,
//         message: "Appointment not found",
//       });
//     }

//     const convertToAmPm = (time24) => {
//       let [hours, minutes] = time24.split(":");
//       hours = Number(hours);
//       const period = hours >= 12 ? "PM" : "AM";
//       hours = hours % 12 || 12;
//       return `${hours}:${minutes} ${period}`;
//     };

//     const transporter = nodeMailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.GMAIL,
//         pass: process.env.PASS,
//       },
//       tls: {
//         rejectUnauthorized: false, // 👈 THIS LINE FIXES IT
//       },
//     });

//     // ------------------ PATIENT EMAIL ------------------
//     const patientMail = {
//       from: process.env.GMAIL,
//       to: appointment.patientId.email,
//       subject:
//         status === "approved"
//           ? `Appointment Approved with ${appointment.doctorId.name}`
//           : `Appointment Rejected with ${appointment.doctorId.name}`,
//       html: `
//         <h2>Appointment ${status.toUpperCase()}</h2>
//         <ul>
//           <li><b>Patient:</b> ${appointment.patientId.name}</li>
//           <li><b>Doctor:</b> ${appointment.doctorId.name}</li>
//           <li><b>Date:</b> ${appointment.date}</li>
//           <li><b>Time:</b> ${convertToAmPm(appointment.time)}</li>
//         </ul>
//       `,
//     };

//     // ------------------ DOCTOR EMAIL ------------------
//     const doctorMail = {
//       from: process.env.GMAIL,
//       to: appointment.doctorId.email,
//       subject: `You ${status} an appointment`,
//       html: `
//         <h2>Appointment ${status.toUpperCase()}</h2>
//         <ul>
//           <li><b>Patient:</b> ${appointment.patientId.name}</li>
//           <li><b>Date:</b> ${appointment.date}</li>
//           <li><b>Time:</b> ${convertToAmPm(appointment.time)}</li>
//         </ul>
//       `,
//     };

//     // Send both emails
//     await transporter.sendMail(patientMail);
//     await transporter.sendMail(doctorMail);

//     res.status(200).send({
//       success: true,
//       message: `Appointment ${status}`,
//       data: appointment,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       success: false,
//       message: error.message,
//     });
//   }
// };

const getBookedSlotsController = async (req, res) => {
  try {
    const { doctorId, date } = req.query;

    if (!doctorId || !date) {
      return res.status(400).send({
        success: false,
        message: "doctorId and date are required",
      });
    }

    const appointments = await appointmentModel.find({
      doctorId,
      date,
      status: { $ne: "rejected" },
    });

    const bookedSlots = appointments.map((a) => a.time);

    res.status(200).send({
      success: true,
      data: bookedSlots,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Failed to fetch booked slots",
    });
  }
};

const getBookedSlotsController1 = async (req, res) => {
  try {
    const { doctorId, date } = req.query;
    console.log(doctorId, date);

    if (!doctorId || !date) {
      return res.status(400).send({
        success: false,
        message: "doctorId and date are required",
      });
    }

    const appointments = await appointmentModel.find({
      doctorId,
      date,
      status: { $ne: "rejected" },
    });

    const bookedSlots = appointments.map((appt) => {
      const [h, m] = appt.time.split(":");
      return `${h.padStart(2, "0")}:${m.padStart(2, "0")}`;
    });

    console.log(bookedSlots);

    return res.status(200).send({
      success: true,
      data: bookedSlots,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: "Failed to fetch booked slots",
    });
  }
};

const SLOT_DURATION = 30;

const getDoctorAvailabilityByDateController = async (req, res) => {
  try {
    const { doctorId, date } = req.query;
    console.log(doctorId, date);

    if (!doctorId || !date) {
      return res.status(400).send({
        success: false,
        message: "doctorId and date are required",
      });
    }

    const doctor = await doctorModel.findById(doctorId);

    if (!doctor || !doctor.availability) {
      return res.status(404).send({
        success: false,
        message: "Doctor availability not found",
      });
    }

    const { from, to } = doctor.availability;

    const [fromH, fromM] = from.split(":").map(Number);
    const [toH, toM] = to.split(":").map(Number);

    const totalMinutes = toH * 60 + toM - (fromH * 60 + fromM);

    const totalSlots = Math.floor(totalMinutes / SLOT_DURATION);

    const appointments = await appointmentModel.find({
      doctorId,
      date,
      status: { $ne: "cancelled" },
    });

    const bookedSlots = appointments.map((a) => a.time);

    const isFullyBooked = bookedSlots.length >= totalSlots;

    res.status(200).send({
      success: true,
      data: {
        date,
        doctorId,
        totalSlots,
        bookedSlots,
        bookedCount: bookedSlots.length,
        isFullyBooked,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error checking doctor availability",
      error,
    });
  }
};

module.exports = {
  getDoctorAvailabilityByDateController,
  bookAppointmentController,
  getPatientAppointmentsController,
  getDoctorAppointmentsController,
  updateAppointmentController,
  deleteAppointmentController,
  updateAppointmentStatusController1,
  getBookedSlotsController,
  getBookedSlotsController1,
};
