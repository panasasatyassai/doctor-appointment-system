const nodeMailer = require("nodemailer");
const appointmentModel = require("../models/appointmentModel");
const userModel = require("../models/userModels");
const doctorModel = require("../models/doctorModel");

const transporter = nodeMailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL,
    pass: process.env.PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// console.log("MAIL:", process.env.GMAIL);
// console.log("PASS:", !!process.env.PASS);

 

const convertToAmPm = (time24) => {
     

  let [hours, minutes] = time24.split(":");
  hours = Number(hours);

  const period = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;

  return `${hours}:${minutes} ${period}`;
};

const appointmentReminder = async () => {
    console.log("Reminder job started");

  try {
    const now = new Date();

    const appointments = await appointmentModel.find({
      status: "approved",
      remainderSent: { $ne: true },
    });

    for (let appointment of appointments) {
      const appointmentDateTime = new Date(
        `${appointment.date} ${appointment.time}`
      );
      const remainderTime = new Date(
        appointmentDateTime.getTime() - 60 * 60 * 1000
      );

      if (now >= remainderTime) {
        const patient = await userModel.findOne(appointment.patientId);
        const doctor = await doctorModel.findOne(appointment.doctorId);
        console.log(patient)
        console.log(patient.name)

        if (!patient || !doctor) continue;

        await transporter.sendMail({
          from: process.env.GMAIL,
          to: patient.email,
          subject: "Appointment Remainder",
          html: `
                <h2> Appointment Remainder </h2> 
                <p> Hello <b>${patient.name}</b>, </p> 
                <ul> 
                    <li><b>Doctor:</b> Dr. ${doctor.name}</li>
                    <li><b>Date:</b> ${appointment.date}</li>
                    <li><b>Time:</b> ${convertToAmPm(appointment.time)}</li>
                </ul> 
                <p>Please be on time.</p>
                `,
        });

        appointment.reminderSent = true 
        await appointment.save()
        console.log(`Remainder Sent to : ${patient.email}`)
      }
    }
  } catch (error) {
    console.log(`Remainder error : ${error.message}`)
  }
};

// appointmentReminder()

// setInterval(() => {
//     appointmentReminder()
// }, 5 * 60 * 1000)

module.exports = appointmentReminder;
