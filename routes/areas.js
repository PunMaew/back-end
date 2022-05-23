const express = require("express");
const router = express.Router();
const cleanBody = require("../middlewares/cleanbody");
const AuthController = require("../src/controller/areaController");

router.post("/addArea", cleanBody, AuthController.AddArea);

module.exports = router;
