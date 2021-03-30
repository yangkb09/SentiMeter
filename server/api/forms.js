const router = require('express').Router()
const Form = require('../db/models/form')

router.get('/', async (req, res, next) => {
  try {
    const scores = await Form.findAll({
      // where: {formText: req.body.formText}
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

    // The text to analyze
    const text = req.body.formText

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

// router.post('/', (req, res, next) => {
//   try {
//     Form.create(req.body)
//     .then(text => res.json(text))
//   } catch (err) {
//     next(err)
//   }
// })

module.exports = router
