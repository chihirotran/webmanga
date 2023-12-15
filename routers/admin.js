const express = require("express");
const User = require("../model/user");
const  createController  = require("../controllers/createController");
const mongoose = require('mongoose');
const Comic = require("../model/comic");
const ObjectId = mongoose.Types.ObjectId;
const fs = require('fs');
const Coment = require('../model/comment');
const Chapter = require('../model/Chapter');
const Category = require('../model/Category');
const Souce = require('../model/SourceManga')
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
  const useradmin = await User.findOne({ username: user, $or: [{ role: 2 }, { admin: true }] });
  if(!useradmin){
    res.redirect("/")
  }else{
  const user_data=await User.find({});
  
  // console.log(user_data);
  if(req.query.action=="duyet"){
    
    await User.updateMany(
      {
        username: req.query.username
      },
      {
        $set: {
          role: 1
        },
      }
    );
    res.redirect("/adminacc");
  }
  const categoryy = req.session.catess;
  const result = await Comic.find({author_id:user })
  res.render('adminacc.ejs',{isLoggedIn,user,user_data,categoryy,result});}
})
router.get("/admincmt",async(req,res)=>{
  const user=req.session.username;
  const isLoggedIn=req.session.isLoggedIn;
  const useradmin = await User.findOne({ username: user, $or: [{ role: 2 }, { admin: true }] });
  if(!useradmin){
    res.redirect("/")
  }else{
  const user_data=await User.findOne({username:user});
  const categoryy = req.session.catess;
  const result = await Coment.find({})
  
  res.render('admincmt.ejs',{isLoggedIn,user,user_data,categoryy,result});}
})
router.get("/admincraw",async(req,res)=>{
  const user=req.session.username;
  const isLoggedIn=req.session.isLoggedIn;
  const user_data=await User.findOne({username:user});
  const categoryy = req.session.catess;
  const useradmin = await User.findOne({ username: user, $or: [{ role: 2 }, { admin: true }] });
  if(!useradmin){
    res.redirect("/")
  }else{
  const result = await Comic.find({author_id:user })
  const linksorce = req.query.link;
  const titlesource = req.query.titlesource || "#item-detail";
  const LISTCHAPTER = req.query.listchapter || ".list-chapter .chapter";
  const linkimg = req.query.linkimg || ".reading-detail.box_doc";
  const chapter = req.query.chapter || ".page-chapter";

  res.render('admincraw.ejs',{isLoggedIn,user,user_data,categoryy,result, linksorce,titlesource,LISTCHAPTER,linkimg,chapter});}
})
router.get("/admincrawsetting",async(req,res)=>{
  const user=req.session.username;
  const isLoggedIn=req.session.isLoggedIn;
  const user_data=await User.findOne({username:user});
  const categoryy = req.session.catess;
  const useradmin = await User.findOne({ username: user, $or: [{ role: 2 }, { admin: true }] });
  if(!useradmin){
    res.redirect("/")
  }else{
  const result = await Souce.find({})
  res.render('admincrawsetting.ejs',{isLoggedIn,user,user_data,categoryy,result});}
})
router.get("/adminmanga",async(req,res)=>{
  const user=req.session.username;
  const isLoggedIn=req.session.isLoggedIn;
  const user_data=await User.findOne({username:user});
  const categoryy = req.session.catess;
  const useradmin = await User.findOne({ username: user, $or: [{ role: 2 }, { admin: true }] });
  if(!useradmin){
    res.redirect("/")
  }else{
  const result = await Comic.find({})
  if(req.query.action=="del"){
    
    await Comic.deleteOne (
      {
        _id: req.query.mid
      }
    ); 
    return  res.redirect("/adminmanga");
  }
  if(req.query.action=="edit"){
    req.session.emid = req.query.mid;
   const data=  await Comic.findOne (
      {
        _id: req.query.mid
      }
    ); 
    return  res.render("edit-comic.ejs",{isLoggedIn,user,categoryy,data});
  }
  res.render('adminmanga.ejs',{isLoggedIn,user,user_data,categoryy,result});}
})
router.get("/admintag",async(req,res)=>{
  const user=req.session.username;
  const isLoggedIn=req.session.isLoggedIn;
  const user_data=await User.findOne({username:user});
  const categoryy = req.session.catess;
  const useradmin = await User.findOne({ username: user, $or: [{ role: 2 }, { admin: true }] });
  if(!useradmin){
    res.redirect("/")
  }else{
  const result = await Category.find({})
  if(req.query.action=="del"){
    
    await Category.deleteOne (
      {
        _id: req.query.mid
      }
    ); 
    return  res.redirect("/admintag");
  }
  if(req.query.action=="edit"){
    req.session.emid = req.query.mid;
   const data=  await Category.findOne (
      {
        _id: req.query.mid
      }
    ); 
    return  res.render("edit-cate.ejs",{isLoggedIn,user,categoryy,data});
  }
  res.render('admintag.ejs',{isLoggedIn,user,user_data,categoryy,result});}
})



module.exports=router;
