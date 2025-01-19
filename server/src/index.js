require('dotenv').config()

const express = require('express');

const logger = require('./logger')
const API = require('./API')

const path = require('path');

const { app, server } = require('./server')

const websocket = require('./websocket')

const cors = require('cors')

app.use(cors());

(['/', '/clips', '/clips/:date']).map((route) => {
  app.get(route, (req, res) => {
    res.sendFile(path.join(process.env.BUILD, 'index.html'));
  })
});

app.use('/', express.static(process.env.BUILD));

app.use('/static', express.static(process.env.OUTPUT));

app.use('/api', API)

server.listen(process.env.PORT, function () {
  logger.log('startup', `API Started on Port: ${process.env.PORT}`)
})