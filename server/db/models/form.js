const Sequelize = require('sequelize')
const db = require('../db')

const Form = db.define('form', {
  formText: {
    type: Sequelize.TEXT
  },
  score: {
    type: Sequelize.STRING
  },
  magnitude: {
    type: Sequelize.STRING
  }
})

module.exports = Form
