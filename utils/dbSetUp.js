let mongoose = require('mongoose')
require('dotenv').config()

let connection = mongoose.connect(process.env.MONGO_URL)

const credentialSchema = new mongoose.Schema({
  id: String,
  name: String,
  email: String,
  password: String,
  isVerified: Boolean,
})

const CredentialModel = mongoose.model('Credential', credentialSchema)

const userActivitySchema = new mongoose.Schema({
  id: String,
  items: Array,
  statuses: Array,
  themeColor: Object,
})

const UserActivityModel = mongoose.model('UserActivity', userActivitySchema)

module.exports = {
  connection,
  CredentialModel,
  UserActivityModel,
  credentialSchema,
}
