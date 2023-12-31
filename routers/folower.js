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
router.post("/follower:id",async(req,res)=>{
    const isLoggedIn=req.session.isLoggedIn;
    const user=req.session.username;
    const id=req.params.id.split(":")[1];
    const targetObjectId = new ObjectId(id);
    const u=await User.findOneAndUpdate({username:user},
        {
            $push:{
                follower:targetObjectId,
            }
    });
    res.redirect('back');
})
router.post("/unfollower:id",async(req,res)=>{
  const isLoggedIn=req.session.isLoggedIn;
  const user=req.session.username;
  const id=req.params.id.split(":")[1];
  const targetObjectId = new ObjectId(id);
  const u=await User.findOneAndUpdate({username:user},
      {
          $pull:{
              follower:targetObjectId,
          }
  });
  res.redirect('back');
})
router.post("/mangadetail:id",async(req,res)=>{
  const isLoggedIn=req.session.isLoggedIn;
  const user=req.session.username;
  const id=req.params.id.split(":")[1];
  const targetObjectId = new ObjectId(id);
  const u=await User.findOneAndUpdate({username:user},
      {
          $push:{
            mangadetail:targetObjectId,
          }
  });

})
router.post("/history:id",async(req,res)=>{
    const isLoggedIn=req.session.isLoggedIn;
    const user=req.session.username;
    
    const id=req.params.id.split(":")[1];
    const mid = req.query.mid;
    const targetObjectId = new ObjectId(id);
    const targetMangaId = new ObjectId(mid);
    console.log(targetObjectId.toString());
    const u=await Chapter.findOneAndUpdate({_id:targetObjectId},
      {
          $inc:{
            __v:1,
          }
  });
  const c=await Comic.findOneAndUpdate({_id:targetMangaId},
    {
        $inc:{
          __v:1,
        }
});
  User.find({ 'history': { $elemMatch: { ComicID: targetMangaId } },username:user}, async (err, historys) => {
        if (err) {
            console.error(err);
            // Xử lý lỗi tại đây
        } else {
            if(historys.length === 0 ){
                const u = await User.findOneAndUpdate({ username: user }, {
                    $push: {
                      history: {
                        ComicID: targetMangaId,
                        chapterId: targetObjectId,
                    },
                    }
                });

            }
            else {
            // console.log(historys);
            console.log(historys[0].history.length);
            if (historys[0].history.length === 0) {
              const u = await User.findOneAndUpdate({ username: user }, {
                $push: {
                  history: {
                    ComicID: targetMangaId,
                    chapterId: targetObjectId,
                },
                }
            });
                // Xử lý sau khi thực hiện findOneAndUpdate
            } else {
              console.log(targetMangaId);
              await User.findOneAndUpdate(
                { 'history': { $elemMatch: { ComicID: targetMangaId } },username:user},
                { $set: { 'history.$.chapterId': targetObjectId } },);
        }}
   } });

})
router.get("/following",async(req,res)=>{
    const isLoggedIn=req.session.isLoggedIn;
    const user=req.session.username;
    let comics1 = await Comic.find({}).sort({ __v: -1 });
    const categoryy = req.session.catess;
    const pageSize = 2; // Số lượng truyện trên mỗi trang
    const page = parseInt(req.query.page) || 1; // Trang hiện tại, mặc định là trang 1
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
      },
      {
        $sort: { time_upload: -1 } // Sắp xếp theo trường time_upload, 1 là tăng dần, -1 là giảm dần
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
    // for(let i in result){
    //     console.log(result[i]);
    //     console.log("********************************");
    //     console.log(i);
        
    // }
    let dateNow = new Date();
    const totalItems = result.length; // Tổng số truyện từ kết quả aggregate
    const totalPages = Math.ceil(totalItems / pageSize); // Tổng số trang

    const startIndex = (page - 1) * pageSize; // Vị trí bắt đầu của trang hiện tại
    const endIndex = startIndex + pageSize; // Vị trí kết thúc của trang hiện tại

    const comicsOnPage = result.slice(startIndex, endIndex); // Truyện trên trang hiện tại
    const jsonResult = JSON.stringify(result);
    fs.writeFile('comic.json', jsonResult, 'utf8', (err) => {
      if (err) {
        console.error(err);
      } else {
        console.log('Kết quả đã được ghi vào tệp tin comic.json');
      }
    });
    res.render("following.ejs",{isLoggedIn,user,dateNow,result,comics1,categoryy,comicspage: comicsOnPage,totalPages,currentPage: page});});
});
router.get("/mangadetail",async(req,res)=>{
  const isLoggedIn=req.session.isLoggedIn;
  const user=req.session.username;
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

  // const jsonResult = JSON.stringify(result);
  // fs.writeFile('comic.json', jsonResult, 'utf8', (err) => {
  //   if (err) {
  //     console.error(err);
  //   } else {
  //     console.log('Kết quả đã được ghi vào tệp tin comic.json');
  //   }
  // });
  res.render("mangadetail.ejs",{isLoggedIn,user,dateNow,result,categoryy});});
});
router.get("/history",async(req,res)=>{
    const isLoggedIn=req.session.isLoggedIn;
    const user=req.session.username;
    const categoryy = req.session.catess;
    let comics1 = await Comic.find({}).sort({ __v: -1 });
    const pageSize = 2; // Số lượng truyện trên mỗi trang
    const page = parseInt(req.query.page) || 1; // Trang hiện tại, mặc định là trang 1
    Comic.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'chapter_comic',
          foreignField: 'history.chapterId',
          as: 'matchedChaptershistory'
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
          matchedChaptershistory: { $ne: [] },
            "matchedChaptershistory.username": user
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
      },
      {
        $sort: { time_upload: -1 } // Sắp xếp theo trường time_upload, 1 là tăng dần, -1 là giảm dần
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
        const jsonResult = JSON.stringify(result);
        // fs.writeFile('comic.json', jsonResult, 'utf8', (err) => {
        //   if (err) {
        //     console.error(err);
        //   } else {
        //     console.log('Kết quả đã được ghi vào tệp tin comic.json');
        //   }
        // });
      
    // console.log(l,l-5);
    // for(let i in result){
    //     // console.log(result[i]);
        
    // }
    const totalItems = result.length; // Tổng số truyện từ kết quả aggregate
    const totalPages = Math.ceil(totalItems / pageSize); // Tổng số trang

    const startIndex = (page - 1) * pageSize; // Vị trí bắt đầu của trang hiện tại
    const endIndex = startIndex + pageSize; // Vị trí kết thúc của trang hiện tại

    const comicsOnPage = result.slice(startIndex, endIndex); // Truyện trên trang hiện tại
    let dateNow = new Date();
    res.render("history.ejs",{isLoggedIn,user,comics1,dateNow,result,categoryy,comicspage: comicsOnPage,totalPages,currentPage: page});});
});

router.get("/search:Name",async(req,res)=>{
  const isLoggedIn=req.session.isLoggedIn;
  let comics1 = await Comic.find({}).sort({ __v: -1 });
  const user=req.session.username;
  const categoryy = req.session.catess;
  const Name=req.params.Name.split(":")[1];
  // const targetObjectId = new ObjectId(id)
  // const comic=await Comic.find({ chapter_comic: targetObjectId });
  // console.log(comic.title);
  const pageSize = 10; // Số lượng truyện trên mỗi trang
  const page = parseInt(req.query.page) || 1; // Trang hiện tại, mặc định là trang 1
  Comic.aggregate([
    {
      $match: { "title": { $regex: Name, $options: "i" } }
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
        time_upload: { $first: "$time_upload" },
        author_id: { $first: "$author_id" },
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
  // Xử lý lỗi tại đây
} else {
  // console.log(comic);
  // Xử lý kết quả tại đây
  // console.log(id);
  
  const totalItems = result.length; // Tổng số truyện từ kết quả aggregate
  const totalPages = Math.ceil(totalItems / pageSize); // Tổng số trang

  const startIndex = (page - 1) * pageSize; // Vị trí bắt đầu của trang hiện tại
  const endIndex = startIndex + pageSize; // Vị trí kết thúc của trang hiện tại

  const comicsOnPage = result.slice(startIndex, endIndex); 
  // console.log(blogs);
  let dateNow = new Date();
  res.render('search.ejs',{isLoggedIn,user,categoryy,dateNow,comics1,result,comicspage: comicsOnPage,totalPages,currentPage: page,});
}
});});

router.post("/comment:id",async(req,res)=>{
  const isLoggedIn=req.session.isLoggedIn;
  let user=req.session.username;
  if(req.session.username == null) {
    user="An Danh";
  }
  const id=req.params.id.split(":")[1];
  const targetObjectId = new ObjectId(id);
  const u=await Coment.create({
    content:req.body.comment,
    name: user,
    chapter_id:targetObjectId,
    date:new Date(),
    like: 0,
    dislike: 0,
})

res.redirect('back');
})




module.exports=router;
