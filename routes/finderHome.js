const express = require("express");
const router = express.Router();
const cleanBody = require("../middlewares/cleanbody");
const findHomeController = require("../src/controller/finderHomeController");

router.post("/addFindHome", cleanBody, findHomeController.AddFindHome);

module.exports = router;
