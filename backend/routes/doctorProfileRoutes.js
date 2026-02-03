const express = require("express");
const {
  getDoctorProfileController,
} = require("../controllers/doctorProfileController");
const authMiddleware = require("../Middleware/authMiddleware");
const doctorMiddleware = require("../Middleware/doctorMiddleware");

const router = express.Router();

 
router.get(
  "/profile",
  authMiddleware,
  doctorMiddleware,
  getDoctorProfileController
);

module.exports = router;
