const fs = require('node:fs/promises')
const { hash, compare, genSalt } = require('bcryptjs')
const { v4: id } = require('uuid')
var path = require('path')
const pathRoot = path.resolve(__dirname)

async function addUser(data) {
  const storedUsers = await readData()
  const salt = await genSalt(10)
  const hashPass = await hash(data.password, salt)
  const userId = id()

  if (!storedUsers.users) {
    storedUsers.users = []
  }

  storedUsers.users.push({
    ...data,
    password: hashPass,
    id: userId,
    name: data.name,
    isVerified: false,
  })
  await writeData(storedUsers)
  return { id: userId, email: data.email, name: data.name }
}

async function getUser(email) {
  const storedUsers = await readData()
  if (!storedUsers.users || storedUsers.users.length === 0) {
    return null
  }
  const user = storedUsers.users.find((user) => user.email === email)
  if (!user) {
    // !!!NEW CAUTION!!!
    return null
  }
  return user
}

async function changeUserData(user) {
  const storedUsers = await readData()

  const changedUsers = {
    users: [
      ...storedUsers.users.filter(
        (storedUser) => storedUser.email !== user.email
      ),
      user,
    ],
  }
  await writeData(changedUsers)
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
