const express = require("express");
const User = require("../model/user");
const  createController  = require("../controllers/createController");
const mongoose = require('mongoose');
const Comic = require("../model/comic");
const ObjectId = mongoose.Types.ObjectId;
const fs = require('fs');
const Coment = require('../model/comment');
const Chapter = require('../model/Chapter');

const router= express.Router();
// router.post("/admin:id",async(req,res)=>{
//     const isLoggedIn=req.session.isLoggedIn;
//     const user=req.session.username;
//     const id=req.params.id.split(":")[1];
//     const targetObjectId = new ObjectId(id);
//     const u=await User.findOneAndUpdate({username:user},
//         {
//             $push:{
//                 admin:targetObjectId,
//             }
//     });

// })

router.get("/adminacc",async(req,res)=>{
  const user=req.session.username;
  const isLoggedIn=req.session.isLoggedIn;
  const user_data=await User.findOne({username:user});
  const categoryy = req.session.catess;
  const result = await Comic.find({author_id:user })
  res.render('adminacc.ejs',{isLoggedIn,user,user_data,categoryy,result});
})
router.get("/admincmt",async(req,res)=>{
  const user=req.session.username;
  const isLoggedIn=req.session.isLoggedIn;
  const user_data=await User.findOne({username:user});
  const categoryy = req.session.catess;
  const result = await Comic.find({author_id:user })
  res.render('admincmt.ejs',{isLoggedIn,user,user_data,categoryy,result});
})
router.get("/admincraw",async(req,res)=>{
  const user=req.session.username;
  const isLoggedIn=req.session.isLoggedIn;
  const user_data=await User.findOne({username:user});
  const categoryy = req.session.catess;
  const result = await Comic.find({author_id:user })
  res.render('admincraw.ejs',{isLoggedIn,user,user_data,categoryy,result});
})
router.get("/admincrawsetting",async(req,res)=>{
  const user=req.session.username;
  const isLoggedIn=req.session.isLoggedIn;
  const user_data=await User.findOne({username:user});
  const categoryy = req.session.catess;
  const result = await Comic.find({author_id:user })
  res.render('admincrawsetting.ejs',{isLoggedIn,user,user_data,categoryy,result});
})
router.get("/adminmanga",async(req,res)=>{
  const user=req.session.username;
  const isLoggedIn=req.session.isLoggedIn;
  const user_data=await User.findOne({username:user});
  const categoryy = req.session.catess;
  const result = await Comic.find({author_id:user })
  res.render('adminmanga.ejs',{isLoggedIn,user,user_data,categoryy,result});
})
router.get("/admintag",async(req,res)=>{
  const user=req.session.username;
  const isLoggedIn=req.session.isLoggedIn;
  const user_data=await User.findOne({username:user});
  const categoryy = req.session.catess;
  const result = await Comic.find({author_id:user })
  res.render('admintag.ejs',{isLoggedIn,user,user_data,categoryy,result});
})



module.exports=router;
