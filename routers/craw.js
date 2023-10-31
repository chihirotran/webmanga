const express = require("express");
const User = require("../model/user");
const  crawcontro  = require("../controllers/crawlController");
const mongoose = require('mongoose');
const startBrowser = require('./browser');

const router= express.Router();

router.get("/craw",async(req,res)=>{
    const isLoggedIn=req.session.isLoggedIn;
    const user=req.session.username;

    res.render("craw.ejs",{isLoggedIn,user});
    
});

router.post("/craw",async(req,res)=>{
    let browser = startBrowser();
    crawcontro.crawlController(browser,req,res);
    
});


module.exports=router;