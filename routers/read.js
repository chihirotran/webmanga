const express = require("express");
const req = require("express/lib/request");
const Comment = require("../model/comment");
const Post = require("../model/post");
const User = require("../model/user");
const Comic = require("../model/comic");
const Chapter = require("../model/Chapter");
const window=require('window')
const router= express.Router();
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const month=['Jan',"Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];


const fs = require('fs');

router.get("/read:id",async(req,res)=>{
    const isLoggedIn=req.session.isLoggedIn;
    const user=req.session.username;
    const categoryy = req.session.catess;
    const id=req.params.id.split(":")[1];
    // const targetObjectId = new ObjectId(id)
    // const comic=await Comic.find({ chapter_comic: targetObjectId });
    // console.log(comic.title);
    const targetObjectId = new ObjectId(id);
   Comic.find({ 'chapter_comic': targetObjectId }, async (err, comic) => {
  if (err) {
    console.error(err);
    // Xử lý lỗi tại đây
  } else {
    // console.log(comic);
    // Xử lý kết quả tại đây
    // console.log(id);
    
    let number = comic[0].chapter_comic.findIndex(objId => objId.toString() === targetObjectId.toString());
    number += 1;
    const chapters=await Chapter.find({_id:id});
    let comment=await Comment.find({chapter_id:id});
    let dateNow = new Date();
    console.log(comment);
    
    // console.log(blogs);
    // console.log(comment);
    res.render('read-comic.ejs',{chapters:chapters[0],comic:comic[0],isLoggedIn,user,categoryy,comment,month,number,dateNow});
  }
});
    
    // console.log(id);
    // const chapters=await Chapter.find({_id:id});
    // let comment=await Comment.find({blogid:id});
    // if(comment.length>0)
    //     comment=comment[0].content;
    
    // // console.log(blogs);
    
    // res.render('read-comic.ejs',{chapters:chapters[0],comic,isLoggedIn,user,comment,month});
});

router.post("/read:id",async(req,res)=>{

    const isLoggedIn=req.session.isLoggedIn;
    const user=req.session.username;
    
    const id=req.params.id.split(":")[1];

    // console.log(req.body);
    
    const content={user:user,
        comment:req.body.comment,
        date:new Date()
    };
    console.log(content);

    let comment=await Comment.find({blogid:id});

    if(comment.length>0)
    {
        comment= await Comment.findOneAndUpdate({blogid:id},{
            $push:{
                content:{
                    $each:[content],
                    $position:0
                
                }                
            }
        });
        
    }
    else
    {
        comment= await Comment.create({
            blogid:id,

            content:content            

        });
    }
    console.log(comment);

    await User.findOneAndUpdate({username:user},
    {
        $push:{
            comment:comment._id
        }
    });

    const blogs=await Post.find({_id:id});
    comment=await Comment.find({blogid:id});
    if(comment.length>0)
        comment=comment[0].content;
    console.log(comment);

    const redirectory="/read:"+id;
    res.redirect(redirectory);
    
});

module.exports=router;