const express = require("express");
const router = express.Router();
const cleanBody = require("../middlewares/cleanbody");
const  { validateTokenAdmin }  = require("../middlewares/validateTokenAdmin");
const {upload} = require("../src/helpers/filehelper");
const ArticleController = require("../src/controller/articleController");

router.post("/createArticle", validateTokenAdmin, ArticleController.CreateArticle);

router.post("/uploadArticle/:postId", upload.single('image') , ArticleController.SingleuploadArticle);

router.post("/updateImageArticle", upload.single('image') , ArticleController.updateImageArticle);

router.get("/allArticle", cleanBody, ArticleController.AllArticle);

router.get("/oneArticle", cleanBody, ArticleController.FindOneArticle);

router.get("/readFileId", cleanBody, ArticleController.readFile);

router.get("/randomPostArticle", cleanBody, ArticleController.GetMultipleRandom);

router.delete("/delArticle", cleanBody, ArticleController.DeleteArticle);

router.put("/updateArticle", cleanBody, ArticleController.UpdateArticle);

module.exports = router;
