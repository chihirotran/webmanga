const crawl = require('./crawl')
require('dotenv').config();
const AWS = require('aws-sdk');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');
const Comic = require("../model/comic");
const Chapter = require("../model/Chapter");
const path = require('path');
// var inquirer = require('inquirer');

// const autocompletePrompt = require('inquirer-autocomplete-prompt');

// inquirer.registerPrompt('autocomplete', autocompletePrompt.autoComplete);
function pad(n, len) {
    let str = n + '';
    while (str.length < len) str = '0' + str;
    return str;
  }

exports.crawlController = async (browserInstance,req, res) => {
    try {
        const url = req.body.content;
        let browser = await browserInstance
        const user = req.session.username;
        

// ***************************************************************************************
        function deleteDirectory(directoryPath) {
            if (fs.existsSync(directoryPath)) {
            fs.readdirSync(directoryPath).forEach((file, index) => {
                const filePath = path.join(directoryPath, file);
        
                if (fs.lstatSync(filePath).isDirectory()) {
                deleteDirectory(filePath);
                } else {
                fs.unlinkSync(filePath);
                }
            });
        
            fs.rmdirSync(directoryPath);
            console.log(`Deleted directory: ${directoryPath}`);
            } else {
            console.log(`Directory not found: ${directoryPath}`);
            }
        }
// ***************************************************************************************
//      cần so sánh title so với truyện trong databased . Nếu có thì ko tạo comic mới nữa
        let number_chapter_comic = 0;
        const comicyesorno=await Comic.find({title:req.body.title});
        if(comicyesorno.length > 0) {
            number_chapter_comic = comicyesorno[0].chapter_comic.length;
        }else {
// ***************************************************************************************
        const c=await Comic.create({
            title:req.body.title,
            description:req.body.title,
            author_id:"Trung",
            time_upload:new Date(),
            linkimg:"data:image/jpeg;base64,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"
        })
    }


// ***************************************************************************************
        

// ***************************************************************************************
        const ListChapter= await crawl.crawllistChapter(browser, url)

// ***************************************************************************************
//      Cần đếm số chap trong database, rồi sẽ cho i bằng cái đó 
// ***************************************************************************************
        

        for (let i = ListChapter.length - (number_chapter_comic+1); i >= 0 ; i--) {
            const path = require('path');
              // Tạo đường dẫn đầy đủ và tên tập tin duy nhất cho ảnh
              const imageDir = './uploads';
              console.log("trước khi chạy path join");
              let numberfoder = ListChapter.length - i;
              let folder = path.join(imageDir, pad(numberfoder, 4));
            //   let folder = path.join(imageDir, req.body.title, pad(i, 4));
              console.log("path join: "+folder);
              const fs = require('fs');
              fs.mkdirSync(folder, { recursive: true });
            const scrimgchapters = await crawl.crawSrcImgChapter(browser, ListChapter[i].link,folder,user) 
            
            const p = await Chapter.create({

                title: req.body.title,
                description: req.body.title,
                author_id: "Trung",
                linkimg: scrimgchapters, // Đường dẫn hình ảnh sau khi đã tải lên S3
                time_upload:new Date(),
                chapnumber: i,
              });
              const u = await Comic.findOneAndUpdate({ title: req.body.title },
                {
                  $push: {
                    chapter_comic: p._id,
                  },
                }
              );
            // xoá file 
            deleteDirectory(folder);
        }
       

        // const scrimgchapters = await crawl.crawSrcImgChapter(browser, ListChapter[2].link)
        // const urlimgchapters = await crawl.crawImgChapter(browser,scrimgchapters[5].src,ListChapter[1].link)
        // browser.close()
        
    } catch (error) {
        console.log("loi o crawl controller: "+error);
    }
}
