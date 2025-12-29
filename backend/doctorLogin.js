const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const userModel = require("./models/userModels");
require("dotenv").config();

const doctorLogin = async () => {
  await mongoose.connect(process.env.MANGODB_URL);

  const adminExists = await userModel.findOne({ role: "doctor" });
  if (adminExists) {
    console.log("Doctor already exists");
    process.exit();
  }

  const hashedPassword = await bcrypt.hash(process.env.DOCTOR_PASSWORD, 10);

  await userModel.create({
    name: "Doctor",
    email: process.env.DOCTOR_EMAIL,
    password: hashedPassword,
    role: "doctor",
  });

  console.log("Doctor created successfully");
  process.exit();
};

doctorLogin();
