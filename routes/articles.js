const express = require("express");
const router = express.Router();
const cleanBody = require("../middlewares/cleanbody");
const { validateToken } = require ("../middlewares/validateToken");
const {upload} = require("../src/helpers/filehelper");
const ArticleController = require("../src/controller/articleController");

//Define endpoints
router.post("/createArticle", validateToken, ArticleController.CreateArticle);

router.get("/allArticle", cleanBody, ArticleController.AllArticle);

router.get("/readFile", cleanBody, ArticleController.readFile);

router.delete("/delArticle", cleanBody, ArticleController.DeleteArticle);

router.post("/uploadArticle/:postId", upload.single('image') , ArticleController.SingleuploadArticle);

router.post("/updateImageArticle", upload.single('image') , ArticleController.updateImageArticle);

router.put("/updateArticle", cleanBody, ArticleController.UpdateArticle);


module.exports = router;
