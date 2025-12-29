const doctorMiddleware = (req, res, next) => {
  try {
    // authMiddleware MUST run before this
    // so req.user should already exist

    if (!req.user) {
      return res.status(401).send({
        success: false,
        message: "Unauthorized",
      });
    }

    if (req.user.role !== "doctor") {
      return res.status(403).send({
        success: false,
        message: "Doctor access only",
      });
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Doctor authorization failed",
    });
  }
};

module.exports = doctorMiddleware;
