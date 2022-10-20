const express = require("express");
const router = express.Router();
const cleanBody = require("../middlewares/cleanbody");
const { validateToken } = require("../middlewares/validateToken");
const {upload} = require("../src/helpers/filehelper");
const FindHomeController = require("../src/controller/finderHomeController");

//Define endpoints
router.post("/create", validateToken , FindHomeController.Create);

router.post("/singleUpload/:postId", upload.single('image') , FindHomeController.Singleupload);

router.get("/allPost", cleanBody, FindHomeController.FindAllPost);

router.get("/onePost", cleanBody, FindHomeController.FindOnePost);

router.get("/getallFiles", cleanBody, FindHomeController.getallSingleFiles);

router.delete("/deletePost", cleanBody, FindHomeController.DeletePost);

router.put("/updatePost", cleanBody, FindHomeController.Update);

router.get("/getMyPost", cleanBody, FindHomeController.GetMyPost);

router.get("/randomPost", cleanBody, FindHomeController.GetMultipleRandom);

module.exports = router;
