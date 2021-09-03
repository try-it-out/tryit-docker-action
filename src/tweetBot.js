const got = require('got')
const { URL } = require('url')

class TweetBot {
  constructor (twitterSettings) {
    const { apiKey, webAppUrl, webAppSecret } = twitterSettings
    this.apiKey = apiKey
    this.storageUrl = webAppUrl
    this.storageSecret = webAppSecret
    const event = 'semgrep_rule_created'
    this.ifttUrl = `https://maker.ifttt.com/trigger/${event}/with/key/${this.apiKey}`
  }

  async _saveImage (picture) {
    const response = await got.post(this.storageUrl, {
      json: {
        secret: this.storageSecret,
        data: picture
      },
      responseType: 'json'
    })
    const { img } = response.body
    const imgUrl = new URL(img, this.storageUrl)
    return imgUrl.toString()
  }

  async _sendTweet (title, message, imgUrl) {
    const response = await got.post(this.ifttUrl, {
      json: {
        value1: message,
        value2: imgUrl
      }
    })
    return response.body
  }

  async tweet (title, message, picture) {
    console.log('saving image')
    const imgUrl = await this._saveImage(picture)
    console.log(`image saved @ ${imgUrl}`)
    console.log(`tweeting ${title}`)
    const result = await this._sendTweet(title, message, imgUrl)
    console.log(`tweet result: ${result}`)
  }
}

module.exports = TweetBot
