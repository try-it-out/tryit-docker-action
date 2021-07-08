const got = require('got')

module.exports = async function tweet(twitterApiKey, picture, rule) {
	try {
		const event = 'semgrep_rule_created'
		//const response = await got.post(`https://maker.ifttt.com/trigger/${event}/with/key/${twitterApiKey}`, {
		const response = await got.post(`https://enwxg1l0f3esl06.m.pipedream.net`, {
			json: {
				value1: rule.id,
				value2: rule.message,
				value3: 'https://avatars.githubusercontent.com/u/2299241?v=4',
				picture: picture
			},
			responseType: 'json'
		});
		console.log(response.body);
	} catch (error) {
		console.log(error.response.body);
	}
}
