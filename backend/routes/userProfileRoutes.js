const express = require("express");
const router = express.Router();

const authMiddleware = require("../Middleware/authMiddleware");
const { getMyProfile, updateMyProfile } = require("../controllers/userProfileController");

router.get("/get-doctor-profile", authMiddleware, getMyProfile);
router.put("/update-doctor-profile", authMiddleware, updateMyProfile);

module.exports = router;
