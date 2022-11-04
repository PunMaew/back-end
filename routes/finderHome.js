const express = require("express");
const router = express.Router();
const cleanBody = require("../middlewares/cleanbody");
const { validateToken } = require("../middlewares/validateToken");
const {upload} = require("../src/helpers/filehelper");
const FindHomeController = require("../src/controller/finderHomeController");

//? POST Request
router.post("/create", validateToken , FindHomeController.Create);

router.post("/singleUpload/:postId", upload.single('image') , FindHomeController.Singleupload);

router.post("/updateImage", upload.single('image') , FindHomeController.updateImageFindHome);

router.post("/likePost", validateToken ,cleanBody, FindHomeController.LikePost); 

//? GET Request
router.get("/allPost", cleanBody, FindHomeController.FindAllPost);

router.get("/latestPost", cleanBody, FindHomeController.FindAllLatest);

router.get("/oldPost", cleanBody, FindHomeController.FindAlloldPost);

router.get("/onePost", cleanBody, FindHomeController.FindOnePost);

router.get("/readFileIdFindHome", cleanBody, FindHomeController.readFileFindHome);

router.get("/changeStatus", cleanBody, FindHomeController.changeStatus);

router.get("/getAdopt", cleanBody, FindHomeController.getAdopt);

router.get("/getNotAdopt", cleanBody, FindHomeController.getNotAdopt);

router.get("/getMyPost", cleanBody, FindHomeController.GetMyPost);

router.get("/randomPost", cleanBody, FindHomeController.GetMultipleRandom);

router.get("/getLikePost", validateToken,cleanBody, FindHomeController.getLikePost); 

router.get("/getBestmatch", validateToken,cleanBody, FindHomeController.getBestmatch); 


//? DELETE Request
router.delete("/deletePost", cleanBody, FindHomeController.DeletePost);

//? PUT Request
router.put("/updatePost", cleanBody, FindHomeController.Update);

router.put("/updatePostStatus", cleanBody, FindHomeController.changeStatus);




module.exports = router;
