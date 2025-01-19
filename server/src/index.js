require('dotenv').config()

const logger = require('./logger')
const API = require('./API')

const express = require('express')
const app = express()
const cors = require('cors')

app.use(cors())

app.use('/', express.static(process.env.OUTPUT));

app.use('/api', API)

app.listen(process.env.PORT, function () {
  logger.log('startup', `API Started on Port: ${process.env.PORT}`)
})