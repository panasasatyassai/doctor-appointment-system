const express = require("express");
const {
  bookAppointmentController,
  getPatientAppointmentsController,
  getDoctorAppointmentsController,
  updateAppointmentController,
  deleteAppointmentController,
  updateAppointmentStatusController1,
  getBookedSlotsController,
  getBookedSlotsController1,
  getDoctorAvailabilityByDateController,
} = require("../controllers/appointmentController");
const authMiddleware = require("../Middleware/authMiddleware");
const doctorMiddleware = require("../Middleware/doctorMiddleware");

const router = express.Router();

router.post("/book-appointment", authMiddleware, bookAppointmentController);

router.get(
  "/patient-appointments",
  authMiddleware,
  getPatientAppointmentsController
);

router.get(
  "/doctor-appointments",
  authMiddleware,
  getDoctorAppointmentsController
);

router.post(
  "/update-status",
  authMiddleware,
  doctorMiddleware,
  updateAppointmentStatusController1
);

router.get(
  "/doctor-availability",
  authMiddleware,
  getDoctorAvailabilityByDateController
);

router.get("/booked-slots", authMiddleware, getBookedSlotsController1);


router.put("/update/:id", authMiddleware, updateAppointmentController);
router.delete("/delete/:id", authMiddleware, deleteAppointmentController);


module.exports = router;
