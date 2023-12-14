const crawl = require('./crawl')
require('dotenv').config();
const AWS = require('aws-sdk');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');
const Comic = require("../model/comic");
const Chapter = require("../model/Chapter");
const path = require('path');
const Source = require('../model/SourceManga')

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
        const url = req.body.link;
        let browser = await browserInstance
        const user = req.session.username;
        let VTinfo = req.body.divtitle;
        let VTlistchapter = req.body.divchapter;
        let VTread = req.body.divimg;
        let VTread1 = req.body.divimgdetail;
        const Infomanga= await crawl.crawlInfoChapter(browser, url,VTinfo);
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
        const comicyesorno=await Comic.find({title:Infomanga[0].title});
        if(comicyesorno.length > 0) {
            number_chapter_comic = comicyesorno[0].chapter_comic.length;
        }else {
// ***************************************************************************************
        const c=await Comic.create({
            title:Infomanga[0].title,
            description: "Cập nhật sớm nhất tại Nettruyen",
            author_id:"ADMIN",
            time_upload:new Date(),
            linkimg:Infomanga[0].link
        })
    }


// ***************************************************************************************
        

// ***************************************************************************************
        const ListChapter= await crawl.crawllistChapter(browser, url , VTlistchapter)

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
            const scrimgchapters = await crawl.crawSrcImgChapter(browser, ListChapter[i].link,folder,user,VTread,VTread1) 
            
            const p = await Chapter.create({

                title: Infomanga[0].title,
                description: "Cập nhật sớm nhất tại Nettruyen",
                author_id: "ADMIN",
                linkimg: scrimgchapters, // Đường dẫn hình ảnh sau khi đã tải lên S3
                time_upload:new Date(),
                chapnumber: i,
              });
              const u = await Comic.findOneAndUpdate({ title: Infomanga[0].title },
                {
                  $push: {
                    chapter_comic: p._id,
                  },
                }
              );
            // xoá file 
            deleteDirectory(folder);
            const comicyesorno1=await Source.find({linksorce:req.body.link});
        if(comicyesorno1.length > 0) {
          await Source.updateMany(
            {
              linksorce:req.body.link
            },
            {
              $set: {
                number: ListChapter.length,
              },
            }
          );
        }else {
// ***************************************************************************************
        const s = await Source.create({

          linksorce: req.body.link,
          titlesource: VTinfo,
          chapter: VTlistchapter,
          linkimg: VTread, // Đường dẫn hình ảnh sau khi đã tải lên S3
          chapter: VTread1,
          number: ListChapter.length,
        });
    }

            
        }
       

        // const scrimgchapters = await crawl.crawSrcImgChapter(browser, ListChapter[2].link)
        // const urlimgchapters = await crawl.crawImgChapter(browser,scrimgchapters[5].src,ListChapter[1].link)
        // browser.close()
        
    } catch (error) {
        console.log("loi o crawl controller: "+error);
    }
}
