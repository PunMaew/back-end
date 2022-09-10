const express = require("express");
const router = express.Router();
const cleanBody = require("../middlewares/cleanbody");
const { validateToken } = require ("../middlewares/validateToken");
const FindHomeController = require("../src/controller/finderHomeController");

router.post("/create", validateToken, FindHomeController.Create);
router.get("/allPost", cleanBody, FindHomeController.FindAllPost);
router.get("/onePost", cleanBody, FindHomeController.FindOnePost);
router.delete("/deletePost", cleanBody, FindHomeController.DeletePost);
router.put("/updatePost", cleanBody, FindHomeController.Update);
// router.put("/upload", cleanBody, FindHomeController.Upload);
router.get("/getMyPost", cleanBody, FindHomeController.GetMyPost);

module.exports = router;
