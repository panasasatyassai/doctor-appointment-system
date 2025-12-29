const express = require("express") 
const authMiddleware = require("../Middleware/authMiddleware")
const { getAllDoctorsController , registerDoctorController, addDoctorByAdminController, getDoctorProfileController, updateAvailabilityController } = require("../controllers/doctorController")
const { getDoctorSlotsController, createSlotsController } = require("../controllers/slotController")
const { updateAppointmentStatusController, getDoctorAppointmentsController } = require("../controllers/appointmentController")
const doctorMiddleware = require("../Middleware/doctorMiddleware")

const router = express.Router() 

router.get("/get-all-doctors", authMiddleware , getAllDoctorsController) 

router.post("/apply-doctor", authMiddleware , addDoctorByAdminController) 

router.post("/register", authMiddleware, registerDoctorController);  

router.get(
  "/profile",
  authMiddleware,
  doctorMiddleware,
  getDoctorProfileController
);

router.get(
  "/appointments",
  authMiddleware,
  doctorMiddleware,
  getDoctorAppointmentsController
);


router.post(
  "/update-availability",
  authMiddleware,
  doctorMiddleware,
  updateAvailabilityController
);


 


module.exports = router 


