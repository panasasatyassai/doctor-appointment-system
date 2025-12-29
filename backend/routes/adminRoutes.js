const express = require("express");
 
const authMiddleware = require("../Middleware/authMiddleware");
const adminMiddleware = require("../Middleware/adminMiddleware");
const { getAllAppointmentsController, updateDoctorStatusController } = require("../controllers/adminController"); 
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

 

module.exports = router;
