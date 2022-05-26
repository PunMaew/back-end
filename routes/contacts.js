const express = require("express");
const router = express.Router();
const cleanBody = require("../middlewares/cleanbody");
const ContController = require("../src/controller/contactController");

router.post("/addContact", cleanBody, ContController.AddContact);

module.exports = router;
