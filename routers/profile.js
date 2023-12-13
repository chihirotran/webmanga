const express = require("express");
const post = require("../model/post");
const User = require("../model/user");
const Comic = require("../model/comic");

const month=['Jan',"Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const router=express.Router();
const fs = require('fs');
router.get("/profile",async(req,res)=>{
    const user= req.query.username || req.session.username;
    const isLoggedIn=req.session.isLoggedIn;
    const user_data=await User.findOne({username:user});
    const categoryy = req.session.catess;
    Comic.aggregate([
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: 'follower',
            as: 'matchedChaptersUser'
          }
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
            $match: {
                matchedChaptersUser: { $ne: [] },
                "matchedChaptersUser.username": user
                 // Lọc những comic có matchedUsers không rỗng (có ít nhất một follower)
              }
        },
        {
          $group: {
            _id: "$_id",
            title: { $first: "$title" },
            description: { $first: "$description" },
            linkimg: { $first: "$linkimg" },
            time_upload: { $first: "$time_upload " },
            author_id: { $first: "$author_id"},
            // Thêm các trường khác của collection Comic mà bạn muốn bao gồm
            matchedChapters: { $push: "$matchedChapters" },
            matchedChaptersUser: { $push: "$matchedChaptersUser" }
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
                              
              },
            
          }
        }
      ], (err, result) => {
      if (err) {
        console.error(err);
        return;
      }
    // console.log(user_data);
    const comicsOnFollow = result.slice(0, 4);
    const jsonResult = JSON.stringify(result);
  fs.writeFile('comic.json', jsonResult, 'utf8', (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log('Kết quả đã được ghi vào tệp tin comic.json');
    }
  });
    if(!isLoggedIn) {res.render('login.ejs',{isLoggedIn,user,categoryy})}
    else{
    res.render('profile.ejs',{isLoggedIn,user,month,user_data,categoryy,result});}
});});
router.get("/profiledetail",async(req,res)=>{
    const user= req.query.username || req.session.username;
    const isLoggedIn=req.session.isLoggedIn;
    const blogs=await Comic.find({author:user});
    const user_data=await User.findOne({username:user});
    const categoryy = req.session.catess;
    // console.log(user_data);
    if(!isLoggedIn) {res.render('login.ejs',{isLoggedIn,user,categoryy})}
    else{
    res.render('profiledetail.ejs',{isLoggedIn,user,month,user_data,categoryy});}
})
router.get("/profilefollow",async(req,res)=>{
    const user= req.query.username || req.session.username;
    const isLoggedIn=req.session.isLoggedIn;
    const user_data=await User.findOne({username:user});
    const categoryy = req.session.catess;
    Comic.aggregate([
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: 'follower',
            as: 'matchedChaptersUser'
          }
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
            $match: {
                matchedChaptersUser: { $ne: [] },
                "matchedChaptersUser.username": user
                 // Lọc những comic có matchedUsers không rỗng (có ít nhất một follower)
              }
        },
        {
          $group: {
            _id: "$_id",
            title: { $first: "$title" },
            description: { $first: "$description" },
            linkimg: { $first: "$linkimg" },
            time_upload: { $first: "$time_upload " },
            author_id: { $first: "$author_id"},
            // Thêm các trường khác của collection Comic mà bạn muốn bao gồm
            matchedChapters: { $push: "$matchedChapters" },
            matchedChaptersUser: { $push: "$matchedChaptersUser" }
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
                              
              },
            
          }
        }
      ], (err, result) => {
      if (err) {
        console.error(err);
        return;
      }
    // console.log(user_data);
    const comicsOnFollow = result.slice(0, 4);
    if(!isLoggedIn) {res.render('login.ejs',{isLoggedIn,user,categoryy})}
    else{
    res.render('profilefollow.ejs',{isLoggedIn,user,month,user_data,categoryy,result});}
  });
})
router.get("/profileupload",async(req,res)=>{
    const user= req.query.username || req.session.username;
    const isLoggedIn=req.session.isLoggedIn;
    const user_data=await User.findOne({username:user});
    const categoryy = req.session.catess;
    const result = await Comic.find({author_id:user })
    if(!isLoggedIn) {res.render('login.ejs',{isLoggedIn,user,categoryy})}
    else{
    res.render('profileupload.ejs',{isLoggedIn,user,month,user_data,categoryy,result});}
})
router.get("/profilecomment",async(req,res)=>{
    const user= req.query.username || req.session.username;
    const isLoggedIn=req.session.isLoggedIn;
    const blogs=await Comic.find({author:user});
    const user_data=await User.findOne({username:user});
    const categoryy = req.session.catess;
    // console.log(user_data);
    if(!isLoggedIn) {res.render('login.ejs',{isLoggedIn,user,categoryy})}
    else{
    res.render('profilecomment.ejs',{blogs,isLoggedIn,user,month,user_data,categoryy});}
})
router.get("/profilenotice",async(req,res)=>{
    const user= req.query.username || req.session.username;
    const isLoggedIn=req.session.isLoggedIn;
    const blogs=await Comic.find({author:user});
    const user_data=await User.findOne({username:user});
    const categoryy = req.session.catess;
    // console.log(user_data);
    if(!isLoggedIn) {res.render('login.ejs',{isLoggedIn,user,categoryy})}
    else{
    res.render('profilenotice.ejs',{blogs,isLoggedIn,user,month,user_data,categoryy});}
})
router.get("/profilechangepass",async(req,res)=>{
    const user= req.query.username || req.session.username;
    const isLoggedIn=req.session.isLoggedIn;
    const blogs=await Comic.find({author:user});
    const user_data=await User.findOne({username:user});
    const categoryy = req.session.catess;
    // console.log(user_data);
    if(!isLoggedIn) {res.render('login.ejs',{isLoggedIn,user,categoryy})}
    else{
    res.render('profilechangepass.ejs',{blogs,isLoggedIn,user,month,user_data,categoryy});}
})
module.exports=router;