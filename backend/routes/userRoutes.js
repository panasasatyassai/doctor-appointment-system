const express = require("express") 
const {
  loginController,
  registerController,
  getUserProfileController,
  updateUserProfile,
} = require("../controllers/userController");
const authMiddleware = require("../Middleware/authMiddleware");

const router = express.Router();

router.post("/login", loginController);

router.post("/register", registerController);
router.get("/profile3", authMiddleware, getUserProfileController);
router.put("/update-profile3", authMiddleware, updateUserProfile); 

module.exports = router