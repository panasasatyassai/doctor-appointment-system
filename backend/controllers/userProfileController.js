const userModel = require("../models/userModels");
const doctorModel = require("../models/doctorModel");

exports.getMyProfile = async (req, res) => {
  try {
    // const user = await userModel.findById(req.user.id).select("-password");

    let user;

    if (req.user.role === "doctor") {
       
      const doc = (user = await doctorModel
        .findOne({ userId: req.user.id })
        .select("-password"));
      const res = await userModel.findById(req.user.id).select("-password");
     
      user = {
        email: res.email,
        name: doc.name,
      };
    } else {
       
      user = await userModel.findById(req.user.id).select("-password");
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateMyProfile = async (req, res) => {
  try {
    const { name, email } = req.body;

    let updatedUser;

    if (req.user.role === "doctor") {
       
      updatedUser = await doctorModel
        .findOneAndUpdate(
          { userId: req.user.id },  
          { name, email },
          { new: true, runValidators: true },
        )
        .select("-password");

      await userModel
        .findByIdAndUpdate(
          req.user.id,
          { name, },
          { new: true, runValidators: true },
        )
        .select("-password");
    } else {
       
      updatedUser = await userModel
        .findByIdAndUpdate(
          req.user.id,
          { name, email },
          { new: true, runValidators: true },
        )
        .select("-password");
    }

    res.status(200).json({
      success: true,
      message: "Profile updated",
      data: updatedUser,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
