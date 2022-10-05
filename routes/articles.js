const express = require("express");
const router = express.Router();
const cleanBody = require("../middlewares/cleanbody");
const { validateToken } = require ("../middlewares/validateToken");
const ArticleController = require("../src/controller/articleController");

router.post("/createArticle", validateToken, ArticleController.CreateArticle);
router.get("/allArticle", cleanBody, ArticleController.AllArticle);
router.delete("/delArticle", cleanBody, ArticleController.DeleteArticle);

module.exports = router;
