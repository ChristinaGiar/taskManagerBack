const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const dotenv = require('dotenv')
const helmet = require('helmet')
const fs = require('fs')
const path = require('path')
const morgan = require('morgan')
const authRoutes = require('./routes/auth')
const dbRoutes = require('./routes/db')
const { connection } = require('./utils/dbSetUp')

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'access.log'),
  { flags: 'a' }
)
app.use(helmet())
app.use(morgan('combined', { stream: accessLogStream }))
app.use(bodyParser.json())
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization')

  next()
})

app.use(authRoutes)
app.use(dbRoutes)

app.use((error, req, res, next) => {
  const status = error.status || 500
  const message = error.message || 'Something went wrong.'
  res.status(status).json({ message: message })
})

connection
  .then(() => {
    console.log('Connected to MongoDB')
    const PORT = process.env.PORT || 8080
    app.listen(PORT)
    console.log('Listening to ' + PORT)
  })
  .catch((error) => {
    console.log(error)
  })
