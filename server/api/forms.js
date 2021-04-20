const router = require('express').Router()
const Form = require('../db/models/form')
const Twitter = require('twitter-v2') //An asynchronous client library for the Twitter REST and Streaming API's.
const rp = require('request-promise')

const client = new Twitter({
  consumer_key: process.env.TWITTER_API_KEY,
  consumer_secret: process.env.TWITTER_SECRET_KEY,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
  bearer_token: process.env.TWITTER_BEARER_TOKEN
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

    //TWITTER STUFF

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
