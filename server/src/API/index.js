const express = require('express')
const router = express.Router()

const controller = require('./controller')

router.get('/start', controller.startRecording)

router.get('/stop', controller.stopRecording)

router.get('/clips', controller.fetchClips)

router.get('/', controller.fetchStatus)

router.get('/fetch', controller.fetchClip)

router.get('/download', controller.downloadClip)

router.get('/delete', controller.deleteClip)

router.get('/stream', controller.streamVideo)

module.exports = router