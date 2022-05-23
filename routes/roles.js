const express = require("express");
const router = express.Router();
const cleanBody = require("../middlewares/cleanbody");
const AuthController = require("../src/controller/roleController");

router.post("/addRole", cleanBody, AuthController.AddRole);

module.exports = router;
