const userModel = require("../models/userModels");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerController = async (req, res) => {
  try {
    console.log(req.body);

    const existingUser = await userModel.findOne({ email: req.body.email });
    if (existingUser) {
      return res
        .status(200)
        .send({ message: "User already exists", success: false });
    }

    const allowedRoles = ["patient", "doctor"];
    const role = allowedRoles.includes(req.body.role)
      ? req.body.role
      : "patient";

    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      role: role,
    });
    await newUser.save();
    res
      .status(201)
      .send({ message: "Registration Successfully", success: true, newUser });
  } catch (e) {
    console.log(e);
    res.status(500).send({
      success: false,
      message: `Registration Controller ${e.message}`,
    });
  }
};

const loginController = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    // console.log("new user ", req.body.role);
    // console.log("db data user ", user.role);
    if (req.body.role !== user.role) {
      return res
        .status(403)
        .send({ message: "Access denied : role mismatch", success: false });
    }
    if (!user) {
      return res
        .status(200)
        .send({ message: "user not found.", success: false });
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res
        .status(200)
        .send({ message: "Invalid Email or Password ", success: false });
    }
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );

    if (user.role === "admin") {
      return res.status(200).send({
        success: true,
        token,
        message: "Admin login successfully",
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          name: user.name,
        },
      });
    }

    if (user.role === "doctor") {
      return res.status(200).send({
        success: true,
        token,
        message: "Doctor login successfully",
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
        },
      });
    }

    res.status(200).send({
      message: "Login Success",
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        name: user.name,
      },
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: `Error in Login Controller ${error.message}` });
  }
};

const getUserProfileController = async (req, res) => {
  try {
    const user = req.user;

    res.status(200).send({
      success: true,
      message: "User profile fetched successfully",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in fetching user profile",
    });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const { name, email } = req.body;

    const user = await userModel.findById(req.user._id);

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    user.name = name;
    user.email = email;
    await user.save();

    res.status(200).send({
      success: true,
      message: "Profile updated successfully",
      data: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error updating profile",
    });
  }
};

module.exports = {
  loginController,
  getUserProfileController,
  registerController,
  updateUserProfile,
};
