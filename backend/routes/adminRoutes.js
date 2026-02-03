const express = require("express");
 
const authMiddleware = require("../Middleware/authMiddleware");
const adminMiddleware = require("../Middleware/adminMiddleware");
const { getAllAppointmentsController, updateDoctorStatusController } = require("../controllers/adminController"); 

const {
  updateDoctorByAdminController,
  getBookedSlotsCountController,
} = require("../controllers/adminUpdateDoctorController");
const isAdmin = require("../Middleware/isAdmin");

const router = express.Router();

router.get(
  "/get-all-appointments",
  authMiddleware,
  adminMiddleware,
  getAllAppointmentsController
);

router.post(
  "/update-doctor-status",
  authMiddleware,
  adminMiddleware,
  updateDoctorStatusController
);

router.post(
  "/update-doctor",
  authMiddleware,
  isAdmin,
  updateDoctorByAdminController
);

router.get(
  "/doctor-booked-slots/:doctorId",
  authMiddleware,
  isAdmin,
  getBookedSlotsCountController
);

 

module.exports = router;
