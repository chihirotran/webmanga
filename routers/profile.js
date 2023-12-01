const express = require("express");
const post = require("../model/post");
const User = require("../model/user");
const Comic = require("../model/comic");

const month=['Jan',"Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const router=express.Router();

router.get("/profile",async(req,res)=>{
    const user=req.session.username;
    const isLoggedIn=req.session.isLoggedIn;
    const blogs=await Comic.find({author:user});
    const user_data=await User.findOne({username:user});
    const categoryy = req.session.catess;
    // console.log(user_data);
    
    res.render('profile.ejs',{blogs,isLoggedIn,user,month,user_data,categoryy});
})

module.exports=router;