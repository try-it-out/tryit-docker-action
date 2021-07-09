const got = require('got')

module.exports = async function tweet(twitterApiKey, picture, rulei, webAppUrl, webAppSecret) {
	try {
		const event = 'semgrep_rule_created'
		//const response = await got.post(`https://maker.ifttt.com/trigger/${event}/with/key/${twitterApiKey}`, {
		const response = await got.post(webAppUrl, {
			json: {
				value1: rule.id,
				value2: rule.message,
				value3: 'https://avatars.githubusercontent.com/u/2299241?v=4',
        secret: webAppSecret,
				data: picture
			},
			responseType: 'json'
		});
		console.log(response.body);
	} catch (error) {
		console.log(error.response.body);
	}
}
