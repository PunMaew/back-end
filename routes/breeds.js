const express = require("express");
const router = express.Router();
const cleanBody = require("../middlewares/cleanbody");
const BreedController = require("../src/controller/breedController");

router.post("/addBreeds", cleanBody, BreedController.AddBreeds);

module.exports = router;
