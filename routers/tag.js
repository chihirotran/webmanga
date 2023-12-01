const express = require("express");
const User = require("../model/user");
const  createController  = require("../controllers/createController");
const mongoose = require('mongoose');
const Comic = require("../model/comic");
const ObjectId = mongoose.Types.ObjectId;
const router= express.Router();
const fs = require('fs');

router.get("/tag:Name",async(req,res)=>{
  const isLoggedIn=req.session.isLoggedIn;
  const user=req.session.username;
  const categoryy = req.session.catess;
  const Name=req.params.Name.split(":")[1];
  // const targetObjectId = new ObjectId(id)
  // const comic=await Comic.find({ chapter_comic: targetObjectId });
  // console.log(comic.title);

  Comic.aggregate([
    {
      $unwind: "$tag"
    },
    {
      $lookup: {
        from: 'categories',
        localField: 'tag',
        foreignField: 'title',
        as: 'matchedTag'
      }
    },
    {
      $match: { "tag": { $regex: Name, $options: "i" } } // Thay "Anime" bằng giá trị cụ thể hoặc biến Name
    },
    {
      $unwind: "$chapter_comic"
    },
    {
      $lookup: {
        from: 'chapters',
        localField: 'chapter_comic',
        foreignField: '_id',
        as: 'matchedChapters'
      }
    },
    {
      $group: {
        _id: "$_id",
        title: { $first: "$title" },
        description: { $first: "$description" },
        linkimg: { $first: "$linkimg" },
        time_upload: { $first: "$time_upload" },
        author_id: { $first: "$author_id" },
        matchedChapters: { $push: "$matchedChapters" },
        matchedTag: { $push: "$matchedTag" }
      }
    },
    {
      $project: {
        _id: 1,
        title: 1,
        description: 1,
        linkimg: 1,
        time_upload: 1,
        author_id: 1,
        matchedChapters: {
          $reduce: {
            input: "$matchedChapters",
            initialValue: [],
            in: { $concatArrays: ["$$value", "$$this"] }
          }
        }
      }
    }  
  ], (err, result) => {
if (err) {
  console.error(err);
  // Xử lý lỗi tại đây
} else {
  // console.log(comic);
  // Xử lý kết quả tại đây
  // console.log(id);
  const jsonResult = JSON.stringify(result);
    fs.writeFile('comic.json', jsonResult, 'utf8', (err) => {
      if (err) {
        console.error(err);
      } else {
        console.log('Kết quả đã được ghi vào tệp tin comic.json');
      }
    });
  
  // console.log(blogs);
  let dateNow = new Date();
  res.render('search-tag.ejs',{isLoggedIn,user,categoryy,dateNow,result});
}
});});
module.exports=router;
