require('dotenv').config();
const AWS = require('aws-sdk');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
const { Upload } = require('@aws-sdk/lib-storage');
const crawpcategory =  (browser , url) => new Promise(async(resolve, reject) => {
    try {
        console.log("mo tab");
        let page = await browser.newPage();
        // await page.emulate({ viewport: {width: 920, height: 1080}, userAgent: '' });
        await page.goto(url)
        console.log("Tr Cap");
        await page.waitForSelector('#ctl00_divRight')
        console.log("load xong");
        const datacategory = await page.$$eval('#ctl00_divRight > div > div > ul > li', cb =>{
            console.log("callback: ",cb);
            datacategory = cb.map(c => {
                return{
                    Category: c.querySelector('a').innerText,
                    link: c.querySelector('a').href,
                }
            })
            return datacategory
        });

        // console.log(datacategory);
        await page.close();
        console.log(">> Da Dong Browser");
        resolve(datacategory)

    } catch (error) {
        console.log("loi category error: " + error);
        reject(error);
    }
})

const crawlNameChapter =  (browser , url) => new Promise(async(resolve, reject) => {
    try {
        console.log("mo tab");
        let page = await browser.newPage();
        // await page.emulate({ viewport: {width: 920, height: 1080}, userAgent: '' });
        await page.goto(url)
        console.log("Tr Cap");
        await page.waitForSelector('#ctl00_divRight')
        console.log("load xong");
        const datacNameChapter = await page.$$eval('figure', cb =>{
            console.log("callback: ",cb);
            datacNameChapter = cb.map(c => {
                return{
                    Name: c.querySelector('h3 a').innerText,
                    link: c.querySelector('a').href,
                    Chap: c.querySelector('ul > li:first-child > a').innerText,
                }
            })
            return datacNameChapter
        });

        // console.log(datacNameChapter);
        await page.close();
        console.log(">> Da Dong page");
        resolve(datacNameChapter)

    } catch (error) {
        console.log("loi category error1: " + error);
        reject(error);
    }
})

const crawllistChapter =  (browser , url) => new Promise(async(resolve, reject) => {
    try {
        console.log("mo tab");
        let page = await browser.newPage();
        // await page.emulate({ viewport: {width: 920, height: 1080}, userAgent: '' });
        await page.goto(url)
        console.log("Tr Cap");
        await page.waitForSelector('.list-chapter .chapter')
        console.log("Load Xong");
        const datalistchapter = await page.$$eval('.list-chapter .chapter', cb => {
            datalistchapter = cb.map(c => {
                return{
                    chap: c.querySelector('a').innerText,
                    link: c.querySelector('a').href
                }
            })
            return datalistchapter
        })
        

        // console.log(datalistchapter);
        await page.close();
        console.log(">> Da Dong Browser");
        resolve(datalistchapter)

    } catch (error) {
        console.log("loi category error1: " + error);
        reject(error);
    }
})
function pad(n, len) {
    let str = n + '';
    while (str.length < len) str = '0' + str;
    return str;
  }
const crawSrcImgChapter =  (browser , url , folder,user) => new Promise(async(resolve, reject) => {
    try {
        console.log("mo tab");
        let page = await browser.newPage();
        // await page.emulate({ viewport: {width: 920, height: 1080}, userAgent: '' });
        await page.goto(url)
        console.log("Tr Cap: "+url);
        await page.waitForSelector('.reading-detail.box_doc')
        console.log("Load Xong");
        let linkimgss = [];
        async function uploadFileToS3(filePath,nameimg) {
            const s3Client = new S3Client({
              region: process.env.AWS_BUCKET_REGION,
              credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
              },
            });
          
            const fileStream = fs.createReadStream(filePath);
            const order = 1;
            const randomString = crypto.randomBytes(6).toString('hex');
            const extension = nameimg;
            const filename = `_${order}_${randomString}_${user}${extension}`;
          
            const uploadParams = {
              Bucket: process.env.AWS_BUCKET_NAME,
              Key: filename,
              Body: fileStream,
              ACL: "public-read",
            };
          
            const command = new PutObjectCommand(uploadParams);
          
            try {
              const response = await s3Client.send(command);
            //   console.log("File uploaded successfully");
                let linkfinal = "https://"+process.env.AWS_BUCKET_NAME+".s3."+process.env.AWS_BUCKET_REGION+".amazonaws.com/"+filename;
              linkimgss.push(linkfinal);


            } catch (err) {
              console.log("Error uploading file:", err);
            }
          }
        
        const datascrimgchapter = await page.$$eval('.page-chapter', cb => {
            datascrimgchapter = cb.map(c => {
                return{
                    src: c.querySelector('img').src
                }
            })
            return datascrimgchapter
        })
        const fs = require('fs');
        const uploadPromises = [];
        for (let i = 1; i <datascrimgchapter.length ; i++) {
            await page.setExtraHTTPHeaders({
                referer: url
              });
              const path = require('path');
            //   // Tạo đường dẫn đầy đủ và tên tập tin duy nhất cho ảnh
            //   const imageDir = 'D:\\nettruyen-master\\puppetter\\chapter';
            //   console.log("trước khi chạy path join");
            //   let folder = path.join(imageDir, 'chapters', pad(i, 4));
            //   console.log("path join: "+folder);
            //   const fs = require('fs');
            //   fs.mkdirSync(folder, { recursive: true });
            //   if (!fs.existsSync(folder)) {
            //     // Nếu thư mục không tồn tại, tạo thư mục mới
            //     fs.mkdirSync(folder, { recursive: true });
            //     console.log('Đã tạo thư mục thành công.');
            //     } else {
            //     console.log('Thư mục đã tồn tại.');
            //     }
            // fs.mkdirSync(folder);
              const imageName = `image_${i}.jpg`;
              const imagePath = path.join(folder, imageName);
              // Tải xuống ảnh và lưu vào đường dẫn đầy đủ
      
              const photoBuffer = await page.goto(datascrimgchapter[i].src).then((response) => response.buffer());
              fs.writeFileSync(imagePath, photoBuffer);
            //   console.log(imagePath);
              
            //   uploadFileToS3(imagePath,imageName);
            uploadPromises.push(uploadFileToS3(imagePath, imageName));
              
        }
           
        await Promise.all(uploadPromises);
        // console.log(datascrimgchapter);
        await page.close();
        console.log(">> Da Dong tab");
        resolve(linkimgss)

    } catch (error) {
        console.log("loi category error1: " + error);
        reject(error);
    }
})


const crawImgChapter =  (browser , url,url1) => new Promise(async(resolve, reject) => {
    try {
        console.log("mo tab");
        let page = await browser.newPage();
        // await page.emulate({ viewport: {width: 920, height: 1080}, userAgent: '' });
        await page.setExtraHTTPHeaders({
            referer: url1
          });
        await page.goto(url)
        console.log("Tr Cap: "+url);
        const path = require('path');
        // Tạo đường dẫn đầy đủ và tên tập tin duy nhất cho ảnh
        const imageDir = 'D:\\nettruyen-master\\puppetter\\chapter';
        const imageName = `image_${Date.now()}.jpg`;
        const imagePath = path.join(imageDir, imageName);
        const fs = require('fs');
        // Tải xuống ảnh và lưu vào đường dẫn đầy đủ

        const photoBuffer = await page.goto(url).then((response) => response.buffer());
        fs.writeFileSync(imagePath, photoBuffer);
    
          
        console.log("chup anh thanh cong");
        // await page.close();
        // console.log(">> Da Dong Browser");
        resolve()

    } catch (error) {
        console.log("loi category error1: " + error);
        reject(error);
    }
})

module.exports = {
    crawpcategory,
    crawlNameChapter,
    crawllistChapter,
    crawImgChapter,
    crawSrcImgChapter
}