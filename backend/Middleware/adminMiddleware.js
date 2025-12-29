

const adminMiddleware = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).send({
        success: false,
        message: "Unauthorized",
      });
    }

    if (req.user.role !== "admin") {
      return res.status(403).send({
        success: false,
        message: "Admin access only",
      });
    }

    next();
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Admin authorization failed",
    });
  }
};

module.exports = adminMiddleware;
