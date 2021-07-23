const RulesFetcher = require('./rulesFetcher')
const ImageGenerator = require('./imageGenerator')
const TweetBot = require('./tweetBot')
const action = require('./action')

;(async () => {
  // get event data and secrets
  const event = JSON.parse(process.argv[2])
  const githubToken = process.argv[3]
  const twitterToken = process.argv[4]
  const webAppUrl = process.argv[5]
  const webAppSecret = process.argv[6]

  // init
  const rulesFetcher = new RulesFetcher(githubToken)
  const img = new ImageGenerator()
  const bot = new TweetBot({ apiKey: twitterToken, webAppUrl, webAppSecret })

  // run action
  await action(event, rulesFetcher, img, bot)

  // clean up
  await img.close()
  console.log('success!')
})()
