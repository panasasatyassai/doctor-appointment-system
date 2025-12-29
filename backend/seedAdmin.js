const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const userModel = require("./models/userModels");
require("dotenv").config();

const seedAdmin = async () => {
  await mongoose.connect(process.env.MANGODB_URL);

  const adminExists = await userModel.findOne({ role: "admin" });
  if (adminExists) {
    console.log("Admin already exists");
    process.exit();
  }

  const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

  await userModel.create({
    name: "Satya Sai",
    email: process.env.ADMIN_EMAIL,
    password: hashedPassword,
    role: "admin",
  });

  console.log("Admin created successfully");
  process.exit();
};

seedAdmin();
