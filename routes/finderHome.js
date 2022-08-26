const express = require("express");
const router = express.Router();
const cleanBody = require("../middlewares/cleanbody");
const { validateToken } = require ("../middlewares/validateToken");
const FindHomeController = require("../src/controller/finderHomeController");

router.post("/addFindHome", cleanBody, FindHomeController.AddFindHome);
router.post("/create", validateToken, FindHomeController.create);


module.exports = router;
