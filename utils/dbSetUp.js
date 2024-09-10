let mongoose = require('mongoose')
require('dotenv').config()

let connection = mongoose.connect(process.env.MONGO_URL)

const credentialSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  isVerified: Boolean,
})

const CredentialModel = mongoose.model('Credentials', credentialSchema)

const userActivitySchema = new mongoose.Schema({
  items: Array,
  statuses: Array,
  themeColor: Object,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Credentials',
  },
})

const UserActivityModel = mongoose.model('UserActivity', userActivitySchema)

module.exports = {
  connection,
  CredentialModel,
  UserActivityModel,
  credentialSchema,
}
