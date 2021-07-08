const fetchRules = require('./fetchRules');
const produceImage = require('./produceTweetImage')
const tweet = require('./tweet')

;(async () => {
	const event = JSON.parse(process.argv[2])
	const githubToken = process.argv[3]
	const twitterToken = process.argv[4]
	// fetching new rules
	const repo = event.repository.name
	const owner = event.repository.owner.name
	const rules = []
	console.log(`${event.commits.length} commits found`)
	for (let i = 0; i < event.commits.length; i++) {
		const refId = event.commits[i].id
		console.log(`fetching rules from: ${refId}`)
		const newRules = await fetchRules(githubToken, owner, repo, refId)
		rules.push(...newRules)
	}
	// generating picture for tweet and posting it to Twitter
	for (let i = 0; i < rules.length; i++) {
		console.log(`creating picture for: ${rules[i].id}`)
		const picture = await produceImage(rules[i].id, rules[i].message, rules[i].languages[0])
		console.log(`sending tweet for: ${rules[i].id}`)
		await tweet(twitterToken, picture, rules[i])
	}
	const time = (new Date()).toTimeString();
	console.log('success!')
})()
