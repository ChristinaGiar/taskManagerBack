const express = require('express')
const { KEY } = require('../utils/constants')
const jwt = require('jsonwebtoken')

const router = express.Router()
const {
  getUser,
  addUser,
  changeUserData,
  checkPassword,
} = require('../data/data')
const { createJWToken, createJWEmailToken } = require('../utils/token')

router.post('/signup', async (req, res) => {
  const email = req.body.email
  const password = req.body.password
  const name = req.body.name
  const serverErrors = {}

  const existingUser = await getUser(email)
  if (existingUser) {
    serverErrors.email = 'Email already exists. '
  }

  if (Object.keys(serverErrors).length > 0) {
    return res.status(422).json({ serverErrors: serverErrors })
  }

  try {
    const newUser = await addUser({ email, password, name, isVerified: false })
    const authToken = createJWEmailToken(email)

    res.status(201).json({
      message: 'User created. ',
      user: { ...newUser },
      emailURL: `${process.env.FRONTEND_URL}/verify?token=${authToken}`,
    })
  } catch (err) {
    if (!err.status) {
      err.status = 500
    }
    next(err)
  }
})

router.post('/login', async (req, res) => {
  const email = req.body.email
  const password = req.body.password
  let result

  try {
    const user = await getUser(email)
    if (user) {
      result = (await checkPassword(password, user.password)) ? user : null
    }
    if (!user || !result) {
      return res.status(422).json({
        serverError: {
          noMatch: 'Invalid email or password',
        },
      })
    }

    const token = createJWToken(email)
    res.json({
      token,
      user: {
        name: user.name,
        isVerified: user.isVerified,
        id: user._id.toString(),
      },
    })
  } catch (err) {
    if (!err.status) {
      err.status = 500
    }
    next(err)
  }
})

// https://yourapp.com/verify?token=your-generated-jwt-token
router.get('/verify', (req, res) => {
  const token = decodeURI(req.query.token)
  const EMAIL_KEY = 'KE34Ffsvb9gU5eL2'

  try {
    jwt.verify(token, EMAIL_KEY, async (err, decoded) => {
      if (err) {
        // console.log(err)
        return res
          .status(400)
          .json({ isVerified: false, message: 'Token invalid or expired' })
      }
      const user = await getUser(decoded.email)
      if (!user) {
        return res
          .status(401)
          .json({ isVerified: false, message: 'User not found' })
      }
      await changeUserData({ ...user, isVerified: true })

      return res.status(200).json({ isVerified: true })
    })
  } catch (err) {
    if (!err.status) {
      err.status = 500
    }
    next(err)
  }
})

module.exports = router
