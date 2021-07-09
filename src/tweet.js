const got = require('got')
const {URL} = require('url')

module.exports = async function tweet(twitterApiKey, picture, rule, webAppUrl, webAppSecret) {
	try {
		const event = 'semgrep_rule_created'
    console.log(`saving image`)
		const response = await got.post(webAppUrl, {
			json: {
        secret: webAppSecret,
				data: picture
			},
			responseType: 'json'
		});
    const {img} = response.body
    const imgURL = new URL(img, webAppUrl)
    console.log(`image saved @ ${imgURL.toString()}`)

    console.log(`tweeting ${rule.id}`)
		const response2 = await got.post(`https://maker.ifttt.com/trigger/${event}/with/key/${twitterApiKey}`, {
			json: {
				value1: rule.id,
				value2: rule.message,
				value3: imgURL.toString()
			}
    })
    console.log(response2.body)
	} catch (error) {
		console.log(error);
	}
}
