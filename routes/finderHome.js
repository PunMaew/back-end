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

router.get("/oldPost", cleanBody, FindHomeController.FindAlloldPost);

router.get("/onePost", cleanBody, FindHomeController.FindOnePost);

router.get("/readFileIdFindHome", cleanBody, FindHomeController.readFileFindHome);

router.get("/notification", cleanBody, FindHomeController.getStausCat);

router.delete("/deletePost", cleanBody, FindHomeController.DeletePost);

router.put("/updatePost", cleanBody, FindHomeController.Update);

router.put("/updatePostStatus", cleanBody, FindHomeController.UpdateStatus);

router.get("/getMyPost", cleanBody, FindHomeController.GetMyPost);

router.get("/randomPost", cleanBody, FindHomeController.GetMultipleRandom);

module.exports = router;
