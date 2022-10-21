const express = require("express");
const router = express.Router();
const cleanBody = require("../middlewares/cleanbody");
const { validateToken } = require("../middlewares/validateToken");
const {upload} = require("../src/helpers/filehelper");
const FindHomeController = require("../src/controller/finderHomeController");

//Define endpoints
router.post("/create", validateToken , FindHomeController.Create);

router.post("/singleUpload/:postId", upload.single('image') , FindHomeController.Singleupload);

router.post("/updateImage", upload.single('image') , FindHomeController.updateImageFindHome);

router.get("/allPost", cleanBody, FindHomeController.FindAllPost);

router.get("/latestPost", cleanBody, FindHomeController.FindAllLatest);

router.get("/onePost", cleanBody, FindHomeController.FindOnePost);

router.get("/readFileIdFindHome", cleanBody, FindHomeController.readFileFindHome);

router.delete("/deletePost", cleanBody, FindHomeController.DeletePost);

router.put("/updatePost", cleanBody, FindHomeController.Update);

router.get("/getMyPost", cleanBody, FindHomeController.GetMyPost);

router.get("/randomPost", cleanBody, FindHomeController.GetMultipleRandom);

module.exports = router;
