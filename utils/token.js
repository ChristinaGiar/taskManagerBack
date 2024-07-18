const { sign } = require('jsonwebtoken')
// const {KEY} = require('./constants');
const KEY = 'de8@!fr3F4kgDr'
const EMAIL_KEY = 'KE34Ffsvb9gU5eL2'

function createJWToken(email) {
  return sign({ email }, KEY, { expiresIn: '1h' })
}

function createJWEmailToken(email) {
  return sign({ email }, EMAIL_KEY, { expiresIn: '24h' })
}

exports.createJWToken = createJWToken
exports.createJWEmailToken = createJWEmailToken
