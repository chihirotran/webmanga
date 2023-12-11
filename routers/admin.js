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
router.post("/admin:id",async(req,res)=>{
    const isLoggedIn=req.session.isLoggedIn;
    const user=req.session.username;
    const id=req.params.id.split(":")[1];
    const targetObjectId = new ObjectId(id);
    const u=await User.findOneAndUpdate({username:user},
        {
            $push:{
                admin:targetObjectId,
            }
    });

})

router.get("/admin",async(req,res)=>{
    const isLoggedIn=req.session.isLoggedIn;
    const user=req.session.username;
    const categoryy = req.session.catess;
    Comic.aggregate([
          {
            $lookup: {
              from: 'users',
              localField: '_id',
              foreignField: 'admin',
              as: 'matchedChaptersUser'
            }
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
                },
                $reduce: {
                  input: "$matchedChaptersUser",
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

    const jsonResult = JSON.stringify(result);
    fs.writeFile('comic.json', jsonResult, 'utf8', (err) => {
      if (err) {
        console.error(err);
      } else {
        console.log('Kết quả đã được ghi vào tệp tin comic.json');
      }
    });
    res.render("admin.ejs",{isLoggedIn,user,dateNow,result,categoryy});});
});





module.exports=router;
