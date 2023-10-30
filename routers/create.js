const express = require("express");
const  createController  = require("../controllers/createController");

const router= express.Router();



router.get("/create-post",createController.getInputForm);
router.post("/create-post",createController.createPost);
router.get("/create-comic",createController.getInputFormComic);
router.post("/create-comic",createController.createComic);
router.get("/create-chapter",createController.getInputFormChapter);
router.post("/create-chapter",createController.createChapterS3);

router.get("/create-chapter-test",createController.getInputFormIMGChapter);
router.post("/create-chapter-test",createController.createIMGChapter);
module.exports=router;
