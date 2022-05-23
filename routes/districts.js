const express = require("express");
const router = express.Router();
const cleanBody = require("../middlewares/cleanbody");
const DistController = require("../src/controller/districtController");

router.post("/addDist", cleanBody, DistController.AddDistrict);

module.exports = router;
