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
    User.find({ 'history': targetObjectId }, async (err, history) => {
        if (err) {
            console.error(err);
            // Xử lý lỗi tại đây
        } else {
            if (history.length === 0) {
                const u = await User.findOneAndUpdate({ username: user }, {
                    $push: {
                        history: id,
                    }
                });
                // Xử lý sau khi thực hiện findOneAndUpdate
            } else {
                // Xử lý khi tìm thấy kết quả
            }
        }
    });

})
module.exports=router;
