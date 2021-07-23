const puppeteer = require('puppeteer')
const ejs = require('ejs')
const fs = require('fs')
const path = require('path')

class ImageGenerator {
  async init () {
    const templateContent = await fs.promises.readFile(path.join(__dirname, 'template/', 'index.html'), 'utf8')
    this.template = ejs.compile(templateContent)
    this.browser = await puppeteer.launch({
      headless: true,
      args: [
        '--disable-dev-shm-usage',
        '--no-sandbox',
        '--disable-setuid-sandbox'
      ]
    })
  }

  async close () {
    if (this.browser) {
      await this.browser.close()
    }
  }

  async produce (ruleMetaData) {
    if (!this.browser) {
      await this.init()
    }
    const { ruleId, message, lang } = ruleMetaData
    const html = this.template({ id: ruleId, message, lang })
    const page = await this.browser.newPage()
    await page.setViewport({
      width: 1200,
      height: 600
    })
    await page.setContent(html)
    const screenshot = await page.screenshot({
      type: 'png',
      encoding: 'base64',
      clip: {
        x: 0,
        y: 0,
        width: 1200,
        height: 600
      }
    })
    await page.close()
    return screenshot
  }
}

module.exports = ImageGenerator
