const express=require("express");
const bodyparser=require("body-parser");
const mongodb=require("mongoose");
const path=require("path");
const session = require("express-session");
const MongoDBStore=require("connect-mongodb-session")(session);
const req = require("express/lib/request");
const port =process.env.PORT || 3000;
const Post=require("./model/post");
const Comic=require("./model/comic");
const month=['Jan',"Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];


const authRoutes=require("./routers/auth");
const registerRoutes=require("./routers/register");
const postRoutes=require("./routers/post");
const createRoutes=require("./routers/create");
const readRoutes=require("./routers/read");
const profileRoutes=require("./routers/profile");
const detailRoutes=require("./routers/detail");
const deleteRoutes=require("./routers/delete");
const followerRoutes=require("./routers/folower");
const crawlRoutes=require("./routers/craw");
const tagRoutes=require("./routers/tag");

const MONGODB_URI="mongodb+srv://chihirotran:Trungtran1501@cluster0.9by4fi3.mongodb.net/?retryWrites=true&w=majority";

const store=new MongoDBStore({uri:MONGODB_URI,collection:"sessions"});

const app=express();
app.use(bodyparser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,'public')));
app.set("view engine","ejs");
app.use(session({secret: "my secret", resave: false, saveUninitialized: false, store: store}));

app.get('/',async(req,res)=>{
    const isLoggedIn=req.session.isLoggedIn;
    const user=req.session.username;
    let comics=await Comic.find({});
    let comics1 =await Comic.find({});
    let dateNow = new Date();
    let l=comics.length;
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
    let l1=0;
    if(l-5>0)
        l1=l-5;
    comics=comics.slice(l1,l);
    res.render("homepage.ejs",{isLoggedIn,user,comics,comics1,month,dateNow,result});});
});

app.use(registerRoutes);
app.use(postRoutes);
app.use(createRoutes);
app.use(authRoutes);
app.use(readRoutes);
app.use(profileRoutes);
app.use(detailRoutes);
app.use(deleteRoutes);
app.use(followerRoutes);
app.use(crawlRoutes);
app.use(tagRoutes);


app.listen(port,()=>{
    console.log("connected at ",port);
});


mongodb.connect(MONGODB_URI,()=>{
    console.log("Connected to mongoose");
});
