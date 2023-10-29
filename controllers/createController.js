const req = require("express/lib/request");
const Post = require("../model/post");
const User = require("../model/user");
const Comic = require("../model/comic");
require('dotenv').config();
const Chapter = require("../model/Chapter");
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { Readable } = require('stream');
const crypto = require('crypto');
const path = require('path');
const { Upload } = require('@aws-sdk/lib-storage');
const AWS = require('aws-sdk');
exports.getInputForm=(req,res)=>{
    const isLoggedIn=req.session.isLoggedIn;
    const user=req.session.username;

    // console.log(isLoggedIn," in crete post get ");
    res.render("create-post.ejs",{isLoggedIn,user});
};
exports.getInputFormComic=(req,res)=>{
    const isLoggedIn=req.session.isLoggedIn;
    const user=req.session.username;
    
    // console.log(isLoggedIn," in crete post get ");
    res.render("create-comic.ejs",{isLoggedIn,user});
};
exports.getInputFormChapter=async(req,res)=>{
    const isLoggedIn=req.session.isLoggedIn;
    const user=req.session.username;
    const comic = await Comic.find({author_id:user})
    // console.log(req.body);
    // console.log(comic);
    // console.log(isLoggedIn," in crete post get ");
    res.render("create-chapter.ejs",{isLoggedIn,user,comic});
};
exports.getInputFormIMGChapter=async(req,res)=>{
    const isLoggedIn=req.session.isLoggedIn;
    const user=req.session.username;
    const comic = await Comic.find({author_id:user})
    // console.log(req.body);
    // console.log(comic);
    // console.log(isLoggedIn," in crete post get ");
    res.render("create-imgchapter.ejs",{isLoggedIn,user,comic});
};

exports.createPost=async(req,res)=>{
    const isLoggedIn=req.session.isLoggedIn;
    const user=req.session.username;

    // console.log(req.body);
    // console.log(isLoggedIn," in createpost ",user);
    const p=await Post.create({
        title:req.body.title,
        content:req.body.content,
        type:req.body.type,
        author:user,
        date:new Date(),
        img:req.body.img
    })
    
    const u=await User.findOneAndUpdate({username:user},
        {
            $push:{
                blog:p._id,
            }
    });
    
    // u[0].posts.push(p._id);
    // console.log(u);
    res.redirect("/");

};
exports.createComic=async(req,res)=>{
    const isLoggedIn=req.session.isLoggedIn;
    const user=req.session.username;

    // console.log(req.body);
    // console.log(isLoggedIn," in createpost ",user);
    const p=await Comic.create({
        title:req.body.title,
        description:req.body.content,
        author_id:user,
        date:new Date(),
        linkimg:req.body.img
    })
    
    const u=await User.findOneAndUpdate({username:user},
        {
            $push:{
                blog:p._id,
            }
    });
    
    // u[0].posts.push(p._id);
    // console.log(u);
    res.redirect("/");

};
exports.createChapter = async (req, res) => {
    const isLoggedIn = req.session.isLoggedIn;
    const user = req.session.username;
  
    // Thiết lập storage cho Multer
    const storage = multer.diskStorage({
        
      destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Thư mục để lưu trữ tệp đã tải lên
      },
      filename: (req, file, cb) => {
        const order = req.body.order || 1; 
       // const randomString = crypto.randomBytes(6).toString('hex');
        cb(null, "_"+order+  user + file.originalname  ); 
      },
    });
  
    // Tạo một đối tượng Multer để xử lý tải lên một tệp duy nhất với trường 'image' trong yêu cầu
    const upload = multer({ storage: storage }).array('avatar');
  
    upload(req, res, async (err) => {
      if (err) {
        // Xử lý lỗi tải lên tệp
        return res.status(500).json({ error: err.message });
      }
  
      // Không có lỗi tải lên tệp, tiếp tục tạo chương
      // const p = await Chapter.create({
      //   title: req.body.title,
      //   description: req.body.content,
      //   author_id: user,
      //   linkimg: req.file.path, // Đường dẫn hình ảnh sau khi đã tải lên bằng Multer
      //   chapnumber: req.body.chapnumber,
      // });
  
      // console.log(req.body.type);
      // const u = await Comic.findOneAndUpdate(
      //   { title: req.body.type },
      //   {
      //     $push: {
      //       chapter_comic: p.chapnumber,
      //     },
      //   }
      // );
  
      res.redirect('/');
    });
  };


exports.createIMGChapter = async (req, res) => {
    const isLoggedIn = req.session.isLoggedIn;
    const user = req.session.username;

    // Cấu hình S3Client
    const s3 = new S3Client({
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
        region: process.env.AWS_BUCKET_REGION,
    });

    const storage = multer.memoryStorage();
    const upload = multer({ storage: storage }).array('avatar');

    upload(req, res, async (err) => {
        if (err) {
            // Xử lý lỗi tải lên tệp
            return res.status(500).json({ error: err.message });
        }

        // Không có lỗi tải lên tệp, tiếp tục tạo chương hoặc thực hiện các thao tác cần thiết

        const uploadPromises = req.files.map((file) => {
            const order = req.body.order || 1;
            const randomString = crypto.randomBytes(6).toString('hex');
            const extension = path.extname(file.originalname);
            const filename = `_${order}_${randomString}_${user}${extension}`;
            
            const params = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: filename,
                Body: new Readable({
                    read() {
                        this.push(file.buffer);
                        this.push(null);
                    }
                }),
                // Thêm ACL để cấu hình quyền truy cập công khai
                ACL: 'public-read'
            };

            const upload = new Upload({
                client: s3,
                params: params,
                leavePartsOnError: false,
                queueSize: 1 // Số lượng phần được tải lên một lúc
            });

            return upload.done();
        });

        // Xây dựng đường dẫn đến tệp
        

        Promise.all(uploadPromises)
            .then(() => {
                res.send('Files uploaded to S3');
            })
            .catch((error) => {
                console.error(error);
                res.status(500).send('Error uploading to S3');
            });
    });
};
