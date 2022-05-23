const express = require("express");
const router = express.Router();
const cleanBody = require("../middlewares/cleanbody");
const contController = require("../src/controller/contactController");

router.post("/addContact", cleanBody, contController.AddContact);

module.exports = router;
