const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteer.use(StealthPlugin());

const startBrowser = async () => {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: 'new', // Opt in to the new headless mode
      args: ["--disable-setuid-sandbox", "--start-fullscreen"],
      ignoreHTTPSErrors: true, // Fixed typo here
      defaultViewport: null,
    });
  } catch (error) {
    console.log("Không tạo được browser: " + error.message);
  }
  return browser;
};

module.exports = startBrowser;