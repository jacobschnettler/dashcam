require('dotenv').config()

const express = require('express');

const logger = require('./logger')
const API = require('./API')

const { app, server } = require('./server')

const websocket = require('./websocket')

const cors = require('cors')

app.use(cors())

app.get('/', (req, res) => res.sendStatus(200));

app.use('/', express.static(process.env.OUTPUT));

app.use('/api', API)

server.listen(process.env.PORT, function () {
  logger.log('startup', `API Started on Port: ${process.env.PORT}`)
})