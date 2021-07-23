async function twitterBotAction (event, rulesFetcher, imageGenerator, tweetBot) {
  // fetching new rules
  const repo = event.repository.name
  const owner = event.repository.owner.name
  const rules = []
  console.log(`${event.commits.length} commits found`)
  for (let i = 0; i < event.commits.length; i++) {
    const refId = event.commits[i].id
    console.log(`fetching rules from: ${refId}`)
    const newRules = await rulesFetcher.getNewSemgrepRules(owner, repo, refId)
    rules.push(...newRules)
  }
  // generating picture for tweet and posting it to Twitter
  for (let i = 0; i < rules.length; i++) {
    console.log(`creating picture for: ${rules[i].id}`)
    const imgSettings = {
      ruleId: rules[i].id,
      message: rules[i].message,
      lang: rules[i].languages[0]
    }
    const picture = await imageGenerator.produce(imgSettings)
    console.log(`sending tweet for: ${rules[i].id}`)
    await tweetBot.tweet(rules[i].id, rules[i].message, picture)
  }
}

module.exports = twitterBotAction
