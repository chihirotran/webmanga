const express = require("express");
const User = require("../model/user");
const  createController  = require("../controllers/createController");
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;


const router= express.Router();
router.post("/follower:id",async(req,res)=>{
    const isLoggedIn=req.session.isLoggedIn;
    const user=req.session.username;
    
    const id=req.params.id.split(":")[1];

    const u=await User.findOneAndUpdate({username:user},
        {
            $push:{
                follower:id,
            }
    });

})
router.post("/history:id",async(req,res)=>{
    const isLoggedIn=req.session.isLoggedIn;
    const user=req.session.username;
    
    const id=req.params.id.split(":")[1];
    const targetObjectId = new ObjectId(id);
    console.log(targetObjectId.toString());
    User.find({ 'history': targetObjectId }, async (err, historys) => {
        if (err) {
            console.error(err);
            // Xử lý lỗi tại đây
        } else {
            if(historys.length === 0 ){
                const u = await User.findOneAndUpdate({ username: user }, {
                    $push: {
                        history: targetObjectId,
                    }
                });
            }
            else {
            console.log(historys);
            console.log(historys[0].history.length);
            if (historys[0].history.length === 0) {
                const u = await User.findOneAndUpdate({ username: user }, {
                    $push: {
                        history: targetObjectId,
                    }
                });
                // Xử lý sau khi thực hiện findOneAndUpdate
            } else {
                // Xử lý khi tìm thấy kết quả
            }
        }}
    });

})
module.exports=router;
