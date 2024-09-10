const fs = require('node:fs/promises')
const { hash, compare, genSalt } = require('bcryptjs')
const { v4: id } = require('uuid')
const { CredentialModel } = require('../utils/dbSetUp')
var path = require('path')
const pathRoot = path.resolve(__dirname)

async function addUser(data) {
  const salt = await genSalt(10)
  const hashPass = await hash(data.password, salt)
  const userId = id()

  const credData = new CredentialModel({
    ...data,
    password: hashPass,
    id: userId,
  })

  credData
    .save()
    .then((doc) => {
      console.log('Credential document saved')
    })
    .catch((error) => {
      console.error('Error saving credential document:', error)
    })
  return { id: credData._id.toString(), email: data.email, name: data.name }
}

async function getUser(email) {
  const user = await CredentialModel.findOne({ email }).lean()

  if (!user) {
    return null
  }
  return user
}

async function changeUserData(userData) {
  const user = await CredentialModel.findOne({
    email: userData.email,
  })

  if (user) {
    user.overwrite({ ...userData })
    await user.save()
  }
}

async function checkPassword(enteredPass, DBpassword) {
  const validPass = await compare(enteredPass, DBpassword)
  return !!validPass
}

async function readData() {
  const data = await fs.readFile(path.join(pathRoot, '..', 'users.json'), {
    encoding: 'utf8',
  })
  return JSON.parse(data)
}

async function writeData(newData) {
  try {
    await fs.writeFile(
      path.join(pathRoot, '..', 'users.json'),
      JSON.stringify(newData)
    )
  } catch (error) {
    console.log(error)
  }
}

exports.addUser = addUser
exports.getUser = getUser
exports.changeUserData = changeUserData
exports.checkPassword = checkPassword
