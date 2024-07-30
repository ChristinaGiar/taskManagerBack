let mongoose = require('mongoose')
require('dotenv').config()

let connection = mongoose.connect(process.env.MONGO_URL)

const credentialSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  id: String,
  isVerified: Boolean,
})

const CredentialModel = mongoose.model('Credential', credentialSchema)

module.exports = { connection, CredentialModel }
