const express = require("express");
const router = express.Router();
const cleanBody = require("../middlewares/cleanbody");
const ArticController = require("../src/controller/articleController");

router.post("/addArticle", cleanBody, ArticController.AddArticle);

module.exports = router;
