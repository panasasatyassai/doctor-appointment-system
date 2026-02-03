const mongoose = require("mongoose");

const userShema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "name is required"],
  },
  email: {
    type: String,
    required: [true, "email is required"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "password is required"],
  },

  role: {
    type: String,
    enum: ["patient", "doctor", "admin"],
    default: "patient",
  },
  
});

const userModels = mongoose.model("users", userShema);

module.exports = userModels;
