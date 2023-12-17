const express = require("express");


const User = require("../model/user");
const  createController  = require("../controllers/createController");
const mongoose = require('mongoose');
const Comic = require("../model/comic");
const ObjectId = mongoose.Types.ObjectId;
const fs = require('fs');
const Coment = require('../model/comment');
const Chapter = require('../model/Chapter');

const month=['Jan',"Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const router=express.Router();

// router.post("/detail",async(req,res)=>{
//     const user=req.session.username;
//     const user_detail=req.body.user_name;
//     const isLoggedIn=req.session.isLoggedIn;
//     const blogs=await post.find({author:user_detail});
//     const user_data=await User.findOne({username:user_detail});

//     if(user_data==undefined)
//     {
//         res.send(user+' not exist');
//     }
//     else
//     {
//         res.render('profile.ejs',{blogs,isLoggedIn,user,month,user_data});
//     }
//     // console.log(user_data);
    
// });

router.get("/detailmanga:id",async(req,res)=>{
    
    const categoryy = req.session.catess;
    const user=req.session.username;
    const user_detail=req.params.id.split(":")[1];
    const isLoggedIn=req.session.isLoggedIn;
    const id=req.params.id.split(":")[1];
    const targetObjectId = new ObjectId(id);
    const comicread = await Comic.find({ 'chapter_comic': targetObjectId });
    console.log(comicread);
    const comicuserfollew = await User.findOne(
      { username: user, 'follower':  comicread[0]._id },
      {  'follower': 1 , _id: 0 }
    );
  let number = comicread[0].chapter_comic.findIndex(objId => objId.toString() === targetObjectId.toString());
  number += 1;
  const chapters=await Chapter.find({_id:id});
  let comment=await Comment.find({chapter_id:id});
  let dateNow = new Date();
  console.log(comicuserfollew);
  console.log(comicread[0]._id);
  let userFollow =false;
  if (comicuserfollew && comicuserfollew.follower.includes(comicread[0]._id)) {
      // Có giá trị trong mảng follower giống với comic[0]._id
       userFollow =true
    }
    const user_data = await User.findOne(
      { username: user, 'history': { $elemMatch: { ComicID: targetObjectId } } },
      {  'history.chapterId': 1 , _id: 0 }
    );
    console.log(user_data);
    Comic.aggregate([
        {
          $match: { "_id": targetObjectId  }
        },
        {
          $unwind: "$chapter_comic" // Mở rộng mảng chapter_comic
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
            tag: { $first: "$tag"},
            // Thêm các trường khác của collection Comic mà bạn muốn bao gồm
            matchedChapters: { $push: "$matchedChapters" }
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
            tag: 1,
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
            return;
          }
    let dateNow = new Date();
    console.log(result);
    let number = result[0].matchedChapters.length -1;
    res.render('mangadetail.ejs',{detailcomic:result[0],isLoggedIn,userFollow,user,month,categoryy,dateNow,number,user_data});
    
    // console.log(user_data);
    
});});


module.exports=router;