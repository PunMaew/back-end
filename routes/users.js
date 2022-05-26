const express = require("express");
const router = express.Router();
const cleanBody = require("../middlewares/cleanbody");
const AuthController = require("../src/controller/userController");
//Define endpoints
router.post("/signup", cleanBody, AuthController.Signup);

router.post("/login", cleanBody, AuthController.Login);

router.patch("/activate", cleanBody, AuthController.Activate);

router.patch("/forgot",cleanBody, AuthController.ForgotPassword);

//router.patch("/reset",cleanBody,AuthController.ResetPassword);

router.patch("/resetotp",cleanBody,AuthController.ResetOtp);

router.patch("/newpassword",cleanBody,AuthController.ResetPassword);

module.exports = router;