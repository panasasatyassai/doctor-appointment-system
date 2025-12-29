const doctorModel = require("../models/doctorModel");
const bcrypt = require("bcryptjs");
const userModel = require("../models/userModels");
// const doctorModel = require("../models/doctorModel");

const registerDoctorController = async (req, res) => {
  try {
    const doctor = new doctorModel({
      userId: req.user._id,
      name: req.body.name,
      specialization: req.body.specialization,
      experience: req.body.experience,
    });

    await doctor.save();

    res.status(201).send({
      success: true,
      message: "Doctor registered successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Doctor registration failed",
    });
  }
};

const addDoctorByAdminController = async (req, res) => {
  try {
    const { name, specialization, experience } = req.body;

    if (!name || !specialization || !experience) {
      return res.status(400).send({
        success: false,
        message: "All fields are required",
      });
    }

    // 🔹 generate email
    const email = name.toLowerCase().replace(/\s+/g, "") + "@hospital.com";

    // 🔹 prevent duplicate doctor
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).send({
        success: false,
        message: "Doctor already exists",
      });
    }

    // 🔹 auto password
    const plainPassword = "doctor@123";
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    // 🔹 create user
    const user = await userModel.create({
      name,
      email,
      password: hashedPassword,
      role: "doctor",
    });

    // 🔹 create doctor profile
    const doctor = await doctorModel.create({
      userId: user._id,
      name,
      specialization,
      experience,
      status: "approved",
    });

    res.status(201).send({
      success: true,
      message: "Doctor added successfully",
      data: doctor,
      credentials: {
        email,
        password: plainPassword, // optional: show once
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Failed to add doctor",
    });
  }
};

const getAllDoctorsController = async (req, res) => {
  try {
    const doctors = await doctorModel
      .find({ status: "approved" })
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      data: doctors,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Failed to fetch doctors",
    });
  }
};

// controllers/doctorController.js

const getDoctorProfileController = async (req, res) => {
  try {
    const doctor = await doctorModel.findOne({
      userId: req.user.id,
    });
    //  console.log(doctor)

    res.status(200).send({
      success: true,
      data: doctor,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Failed to fetch doctor profile",
    });
  }
};

const updateAvailabilityController = async (req, res) => {
  try {
    const { days, from, to } = req.body;
    console.log("REQ BODY DAYS:", req.body.days);


    if (!days || !from || !to) {
      return res.status(400).send({
        success: false,
        message: "Days, from and to are required",
      });
    }

    const doctor = await doctorModel.findOneAndUpdate(
      { userId: req.user._id },
      {
        $set: {
          availability: {
            days,
            from,
            to,
          },
        },
      },
      { new: true } // 🔥 VERY IMPORTANT
    );

    if (!doctor) {
      return res.status(404).send({
        success: false,
        message: "Doctor not found",
      });
    }

    await doctor.save();

    res.status(200).send({
      success: true,
      message: "Availability updated successfully",
      data: doctor.availability,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Failed to update availability",
    });
  }
};

module.exports = {
  updateAvailabilityController,
  getDoctorProfileController,
  registerDoctorController,
  addDoctorByAdminController,
  getAllDoctorsController,
};
