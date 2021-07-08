const puppeteer = require('puppeteer');

(async () => {
	const browser = await puppeteer.launch({
		args: ['--disable-dev-shm-usage'],
	});
  const page = await browser.newPage();
  await page.goto('https://example.com');
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
	console.log(screenshot.substring(0, 11));
  await browser.close();
})();
