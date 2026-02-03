const userModel = require("../models/userModels");

const isAdmin = async (req, res, next) => {
  try {
    const userId = req.user?._id || req.userId;

    if (!userId) {
      return res.status(401).send({
        success: false,
        message: "Unauthorized assess",
      });
    }

    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    if (user.role !== "admin") {
      return res.status(403).send({
        success: false,
        message: "Access denied. Admin only",
      });
    }

    next();
  } catch (e) {
    console.log(e);
    res.status(500).send({
      success: false,
      message: "Admin authorization failed",
    });
  }
};

module.exports = isAdmin;
