const express = require("express");
const router = express.Router();
const cleanBody = require("../middlewares/cleanbody");
const AuthController = require("../src/controller/locController");

router.post("/addLocation", cleanBody, AuthController.AddLoc);

module.exports = router;