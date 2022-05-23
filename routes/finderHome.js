const express = require("express");
const router = express.Router();
const cleanBody = require("../middlewares/cleanbody");
const FindHomeController = require("../src/controller/finderHomeController");

router.post("/addFindHome", cleanBody, FindHomeController.AddFindHome);

module.exports = router;
