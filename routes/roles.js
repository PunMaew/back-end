const express = require("express");
const router = express.Router();
const cleanBody = require("../middlewares/cleanbody");
const RoleController = require("../src/controller/roleController");

router.post("/addRole", cleanBody, RoleController.AddRole);

module.exports = router;
