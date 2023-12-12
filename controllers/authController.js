const req = require("express/lib/request");
const user = require("../model/user");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { Readable } = require("stream");
const crypto = require("crypto");
const path = require("path");
const { Upload } = require("@aws-sdk/lib-storage");
const AWS = require("aws-sdk");
const Cate = require("../model/Category");
exports.logout = (req, res) => {
  req.session.isLoggedIn = false;
  req.session.username = null;

  res.redirect("/");
};

exports.postSignUp = async (req, res) => {
  // console.log("In post signup");

  user.create({
    name: req.body.fullName,
    email: req.body.email,
    password: req.body.password,
    role: 0,
    username: req.body.email.split(["@"])[0],
    posts: [{}],
  });

  req.session.isLoggedIn = true;
  req.session.roles = 0;
  req.session.username = req.body.email.split(["@"])[0];
  res.redirect("/");
};

exports.postLogin = async (req, res) => {
  let User = await user.findOne({
    email: req.body.email,
    password: req.body.password,
  });

  if (User) {
    req.session.isLoggedIn = true;
    req.session.username = User.username;
    req.session.roles = User.role;
    res.redirect("/");
  } else {
    
    res.redirect("/login");
  }
};

exports.ChangePass = async (req, res) => {
    const Usersession = req.session.username;
    await user.updateMany(
        {
          username: Usersession
        },
        {
          $set: {
            password: req.body.NewPassword,
            
          },
        }
      );
      
      res.redirect("/profile");
  };
exports.updateInfo = async (req, res) => {
    const Usersession=req.session.username;
  const s3 = new S3Client({
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    region: process.env.AWS_BUCKET_REGION,
  });

  const storage = multer.memoryStorage();
  const upload = multer({ storage: storage }).array("avatar");

  upload(req, res, async (err) => {
    if (err) {
      // Xử lý lỗi tải lên tệp
      return res.status(500).json({ error: err.message });
    }

    // Không có lỗi tải lên tệp, tiếp tục tạo chương hoặc thực hiện các thao tác cần thiết

    const uploadPromises = req.files.map((file) => {
      const order = req.body.order || 1;
      const randomString = crypto.randomBytes(6).toString("hex");
      const extension = path.extname(file.originalname);
      const filename = `_${order}_${randomString}_${user}${extension}`;

      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: filename,
        Body: new Readable({
          read() {
            this.push(file.buffer);
            this.push(null);
          },
        }),
        // Thêm ACL để cấu hình quyền truy cập công khai
        ACL: "public-read",
      };

      const upload = new Upload({
        client: s3,
        params: params,
        leavePartsOnError: false,
        queueSize: 1, // Số lượng phần được tải lên một lúc
      });

      return upload.done();
    });

    // Xây dựng đường dẫn đến tệp

    Promise.all(uploadPromises)
      .then(async (results) => {
        console.log(req.body.email);
        console.log(req.body.name);
        console.log(req.body.ddGender);
        console.log(Usersession);
        await user.updateMany(
          {
            username: Usersession
          },
          {
            $set: {
              name: req.body.name,
              sex: req.body.ddGender,
              linkimg: results.map((result) => result.Location).join(', '),
            },
          }
        );
        
        res.redirect("/profiledetail");
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("Error uploading to S3");
      });
  });
};
