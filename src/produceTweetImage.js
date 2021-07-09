const puppeteer = require('puppeteer');
const ejs = require('ejs');
const fs = require('fs');
const path = require('path');

module.exports = async function produceTweetImage(ruleId, message, lang) {
	const template = await fs.promises.readFile(path.join(__dirname, 'index.html'), 'utf8')
	const html = ejs.render(template, {
    id: ruleId, message, lang
	})
	
	const browser = await puppeteer.launch({
    headless: true,
		args: [
      '--disable-dev-shm-usage',
      '--no-sandbox',
      '--disable-setuid-sandbox'
    ],
	});
  const page = await browser.newPage();
  await page.setContent(html);
  const screenshot = await page.screenshot({
    type: 'png',
    encoding: 'base64',
		clip: {
			x: 0,
			y: 0,
			width: 1200,
			height: 600
		}
	});

  await browser.close();
  return screenshot;
}
