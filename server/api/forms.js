const router = require('express').Router()
const Form = require('../db/models/form')
const Twitter = require('twitter') //An asynchronous client library for the Twitter REST and Streaming API's.
// const rp = require('request-promise')

const twitterClient = new Twitter({
  consumer_key: process.env.TWITTER_API_KEY,
  consumer_secret: process.env.TWITTER_SECRET_KEY,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
  // bearer_token: process.env.TWITTER_BEARER_TOKEN
})

router.get('/', async (req, res, next) => {
  try {
    const scores = await Form.findAll({
      attributes: ['id', 'score', 'magnitude']
    })
    res.send(scores)
  } catch (err) {
    next(err)
  }
})

router.post('/', async (req, res, next) => {
  try {
    // Imports the Google Cloud client library
    const language = require('@google-cloud/language')

    // Instantiates a client
    const client = new language.LanguageServiceClient({
      keyFilename: 'google.json',
      projectId: 'sentiment-analys-1611430622359'
    })

    // The text to analyze (username)
    //might need separate helper functions. can do twitter stuff after ln 28
    const text = req.body.formText
    const twitterUsername = req.body.formText

    //GET Twitter data (user by un, then user's tweet timeline)
    twitterClient.get(
      '/users/show.json',
      {screen_name: twitterUsername},
      function(error, profile, response) {
        try {
          console.log('TWITTER PROFILE: ', profile)
          const profileImg = profile.profile_image_url.replace(/_normal/, '')
          const profileBanner = profile.profile_banner_url

          //GET Twitter user's tweet timeline (tweets)
          //maybe add include_rts: false
          //callback based async func, need to pass in func to get back info arguments (error, data if it passes)
          //don't need try catch, i won't know if it fails; throw error (return afterwards, or an if else)
          twitterClient.get(
            '/statuses/user_timeline.json',
            {screen_name: twitterUsername, count: 3},
            function(error, tweets, response) {
              try {
                let holder = ''
                for (let i = 0; i < tweets.length; i++) {
                  holder += tweets[i].text
                }
                let cleanedTweets = holder.replace(
                  /(?:https?|ftp):\/\/[\n\S]+/g,
                  ''
                )
                console.log('TWEETS: ', tweets)
                console.log('CLEANED TWEETS: ', cleanedTweets)
              } catch (error) {
                // throw error
                console.log('ERR GET TIMELINE', error)
              }
            }
          )
        } catch (error) {
          throw error
        }
      }
    )

    const document = {
      content: text,
      type: 'PLAIN_TEXT'
    }

    // Detects the sentiment of the text
    const [result] = await client.analyzeSentiment({document: document})
    const sentiment = result.documentSentiment

    console.log(`Text: ${text}`)
    console.log(`Sentiment score: ${sentiment.score}`)
    console.log(`Sentiment magnitude: ${sentiment.magnitude}`)

    Form.create({
      formText: text,
      score: sentiment.score,
      magnitude: sentiment.magnitude
    }).then(stuff => res.json(stuff))
  } catch (err) {
    next(err)
  }
})

module.exports = router
