const crawl = require('./crawl')
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
// ***************************************************************************************
        const ListChapter= await crawl.crawllistChapter(browser, url)
        for (let i = ListChapter.length -1; i >=0 ; i--) {
            const path = require('path');
              // Tạo đường dẫn đầy đủ và tên tập tin duy nhất cho ảnh
              const imageDir = '../uploads';
              console.log("trước khi chạy path join");
              let folder = path.join(imageDir, req.body.title, pad(i, 4));
              console.log("path join: "+folder);
              const fs = require('fs');
              fs.mkdirSync(folder, { recursive: true });
            const scrimgchapters = await crawl.crawSrcImgChapter(browser, ListChapter[i].link,folder) 
        }


        // const scrimgchapters = await crawl.crawSrcImgChapter(browser, ListChapter[2].link)
        // const urlimgchapters = await crawl.crawImgChapter(browser,scrimgchapters[5].src,ListChapter[1].link)
        // browser.close()
        
    } catch (error) {
        console.log("loi o crawl controller: "+error);
    }
}
