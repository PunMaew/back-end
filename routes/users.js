const express = require("express");
const router = express.Router();
const cleanBody = require("../middlewares/cleanbody");
const { validateToken } = require("../middlewares/validateToken");
const AuthController = require("../src/controller/userController");
//Define endpoints
router.post("/signup", cleanBody, AuthController.Signup);

router.post("/login", cleanBody, AuthController.Login);

router.get("/logout", validateToken, AuthController.Logout);

router.patch("/activate", cleanBody, AuthController.Activate);

router.patch("/forgot", cleanBody, AuthController.ForgotPassword);

router.patch("/resetotp", cleanBody, AuthController.ResetOtp);

router.patch("/newpassword", cleanBody, AuthController.ResetPassword);

router.get("/getallusers", cleanBody, AuthController.GetAllUsers);

router.get("/getUserByEmail", cleanBody, AuthController.GetUserByEmail);

router.get("/getUser", validateToken, AuthController.getUser);

router.put("/editProfile", cleanBody, AuthController.EditProfile);

router.put("/againOTP", cleanBody, AuthController.AgainOTP);




module.exports = router;
