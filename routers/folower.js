const express = require("express");
const User = require("../model/user");
const  createController  = require("../controllers/createController");
const mongoose = require('mongoose');
const Comic = require("../model/comic");
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
router.get("/following",async(req,res)=>{
    const isLoggedIn=req.session.isLoggedIn;
    const user=req.session.username;

    Comic.aggregate([
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
              time_upload: { $first: "$time_upload " },
              author_id: { $first: "$author_id"},
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
        // let test_key = 0;    
        // let test_1 = null; 
        // for (const item of result) {
        //     test_1 = item.matchedChapters.find(element => element._id == id);
        //     if (test_1) {
        //         break;
        //     }
        //     test_key += 1;
        // }
        // Hiển thị thông tin của các bản ghi trong kết quả
        // console.log(result);
        
      
    // console.log(l,l-5);
    for(let i in result){
        // console.log(result[i]);
        
    }
    let dateNow = new Date();
    res.render("following.ejs",{isLoggedIn,user,dateNow,result});});
});
router.get("/history",async(req,res)=>{
    const isLoggedIn=req.session.isLoggedIn;
    const user=req.session.username;

    Comic.aggregate([
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
              time_upload: { $first: "$time_upload " },
              author_id: { $first: "$author_id"},
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
        // let test_key = 0;    
        // let test_1 = null; 
        // for (const item of result) {
        //     test_1 = item.matchedChapters.find(element => element._id == id);
        //     if (test_1) {
        //         break;
        //     }
        //     test_key += 1;
        // }
        // Hiển thị thông tin của các bản ghi trong kết quả
        // console.log(result);
        
      
    // console.log(l,l-5);
    for(let i in result){
        // console.log(result[i]);
        
    }
    let dateNow = new Date();
    res.render("history.ejs",{isLoggedIn,user,dateNow,result});});
});
module.exports=router;
