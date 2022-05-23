const express = require("express");
const router = express.Router();
const cleanBody = require("../middlewares/cleanbody");
const ProController = require("../src/controller/provinceController");

router.post("/addPro", cleanBody, ProController.AddProvince);

module.exports = router;
