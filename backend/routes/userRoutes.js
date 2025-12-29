const express = require("express") 
const {loginController , registerController} = require("../controllers/userController")
// const authMiddleware = require("../Middleware/authMiddleware")
// const authController = require("../controllers/authController")


const router = express.Router()
 

router.post('/login' , loginController) 
 
router.post("/register" , registerController) 

// router.post('/getUserData' , authMiddleware , authController )

module.exports = router