const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const dotenv = require('dotenv')

const authRoutes = require('./routes/auth')
const { connection } = require('./utils/mongoSetUp')

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

app.use(bodyParser.json())
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization')

  next()
})

app.use(authRoutes)

app.use((error, req, res, next) => {
  const status = error.status || 500
  const message = error.message || 'Something went wrong.'
  res.status(status).json({ message: message })
})

const PORT = process.env.PORT || 8080
app.listen(PORT, async () => {
  console.log('Listening to ' + PORT)
  try {
    await connection
    console.log('Connected to MongoDB')
  } catch (error) {
    console.log('MongoDB has not been connected')
  }
})
