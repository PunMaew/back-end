const express = require("express");
const router = express.Router();
const cleanBody = require("../middlewares/cleanbody");
const { validateToken } = require("../middlewares/validateToken");
const { validateTokenAdmin } = require("../middlewares/validateTokenAdmin");
const AuthController = require("../src/controller/userController");


router.post("/signup", cleanBody, AuthController.Signup); 

router.post("/signupAdmin", cleanBody, AuthController.SignupAdmin);

router.post("/login", cleanBody, AuthController.Login); 

router.post("/loginAdmin", cleanBody, AuthController.LoginAdminPunmeaw);

router.patch("/activate", cleanBody, AuthController.Activate);

router.patch("/activateAdmin", cleanBody, AuthController.ActivateAdmin);

router.patch("/verify", cleanBody, AuthController.verifyIdentityEmail); 

router.patch("/forgot", cleanBody, AuthController.ForgotPassword);

router.patch("/resetotp", cleanBody, AuthController.ResetOtp);

router.patch("/newpassword", cleanBody, AuthController.ResetPassword);

router.get("/logout", validateToken, AuthController.Logout);

router.get("/logoutAdmin", validateTokenAdmin, AuthController.LogoutAdmin); 

router.get("/getallusers", cleanBody, AuthController.GetAllUsers);

router.get("/getUserByEmail", cleanBody, AuthController.GetUserByEmail);

router.get("/getUserById", cleanBody, AuthController.GetUserById);

router.get("/getUser", validateToken, AuthController.getUser);

router.get("/getBestmatch", validateToken, AuthController.getBestmatch);

router.get("/getIdealCat", validateToken, AuthController.getIdealCat);

router.get("/getAdmin", validateTokenAdmin, AuthController.getAdmin);

router.put("/editProfile", cleanBody, AuthController.EditProfile);

router.put("/againOTP", cleanBody, AuthController.AgainOTPSignup);

router.put("/againOTPEmail", cleanBody, AuthController.AgainOTPEmail);

router.put("/idealCat", validateToken, AuthController.IdealCat);

router.put("/resetEmail", validateToken, AuthController.resetEmail);

router.put("/editEmail", validateToken, AuthController.editEmail);

router.delete("/deleteUser", cleanBody, AuthController.DeleteUser);

module.exports = router;
