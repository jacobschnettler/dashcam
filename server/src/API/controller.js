const fs = require('fs');

const logger = require('../logger')

const ffmpeg = require('../ffmpeg')

const { fetchIsRecording, setMetadata, fetchMetadata } = require('../state');
const { io } = require('../websocket');

const OUTPUT = process.env.OUTPUT;

async function startRecording(req, res) {
    try {
        const recordingDate = new Date();

        const directory = `${OUTPUT}/${recordingDate.toJSON()}`;

        const metadata = {
            date: recordingDate.toJSON()
        };

        await fs.mkdirSync(directory)

        await fs.writeFileSync(`${directory}/metadata.json`, JSON.stringify(metadata), 'utf-8')

        setMetadata(metadata);

        try {
            await ffmpeg.startRecording(metadata)

            io.emit('alert', {
                type: 'success',
                label: 'Recording Started.'
            });

            res.sendStatus(200);
        } catch (err) {
            console.log(err)

            res.sendStatus(505)
        }
    } catch (err) {
        logger.log('error', err)

        res.json({
            error: "Unexpected error while trying to start recording."
        })
    }
}

async function stopRecording(req, res) {
    try {
        await ffmpeg.stopRecording();

        io.emit('alert', {
            type: 'error',
            label: 'Recording Stopped.'
        });

        res.sendStatus(200);
    } catch (err) {
        logger.log('error', err)

        res.json({
            error: "Unexpected error while trying to stop recording."
        })
    }
}

async function fetchClips(req, res) {
    try {
        var clips = [];

        const folders = await fs.readdirSync(OUTPUT)

        for (let i = 0; i < folders.length; i++) {
            try {
                const folder = folders[i];

                const data = await fs.readFileSync(`${OUTPUT}/${folder}/metadata.json`, 'utf-8');

                const metadata = JSON.parse(data);

                if (metadata.finished)
                    clips.push(metadata);
            } catch (err) {
                console.log(err)
            }
        }

        res.json({
            clips: clips
        })
    } catch (err) {
        console.log(err)

        res.json({
            error: 'Unexpected error while trying to fetch clips.'
        })
    }
}

function fetchStatus(req, res) {
    try {
        const isRecording = fetchIsRecording();

        const metadata = fetchMetadata();

        res.send({
            isRecording: isRecording,
            metadata: metadata
        });
    } catch (err) {
        logger.log('error', err)

        res.json({
            error: 'Unexpected error while trying to fetch state.'
        })
    }
}

async function fetchClip(req, res) {
    try {
        const { clip } = req.query

        if (!clip) return res.json({ error: 'Invalid paramaters.' });

        const folder = await fs.readdirSync(`${OUTPUT}/${clip}`)

        if (!folder) return res.json({ error: "Invalid clip." });

        const data = await fs.readFileSync(`${OUTPUT}/${clip}/metadata.json`, 'utf-8')

        const metadata = JSON.parse(data)

        res.json({
            metadata: metadata
        });
    } catch (err) {
        console.log(err)

        res.json({
            error: 'Unexpected error while trying to fetch clip.'
        })
    }
}

async function downloadClip(req, res) {
    try {
        const { clip } = req.query;

        if (!clip) return res.json({ error: 'Invalid parameters.' });

        const folder = await fs.readdirSync(`${OUTPUT}/${clip}`);

        if (!folder) return res.json({ error: "Invalid clip." });

        const data = await fs.readFileSync(`${OUTPUT}/${clip}/metadata.json`, 'utf-8');

        const metadata = JSON.parse(data);

        const filePath = `${OUTPUT}/${metadata.video}`;

        // Set the correct MIME type and content disposition for webm files
        res.setHeader('Content-Type', 'video/webm');
        res.setHeader('Content-Disposition', `attachment; filename=clip.webm`);

        // Serve the file for download
        res.download(filePath, 'clip.webm');
    } catch (err) {
        console.log(err);

        res.json({
            error: 'Unexpected error while trying to download clip.'
        });
    }
}

async function deleteClip(req, res) {
    try {
        const { clip } = req.query

        if (!clip) return res.json({ error: 'Invald paramaters.' });

        const folder = await fs.readdirSync(`${OUTPUT}/${clip}`);

        if (!folder) return res.json({ error: "Invalid clip." });

        await fs.rmSync(`${OUTPUT}/${clip}`, {
            recursive: true,
            force: true
        });

        res.sendStatus(200);
    } catch (err) {
        console.log(err)

        res.json({
            error: "Unexpected error while trying to delete clip."
        })
    }
}

function streamVideo(req, res) {
    try {
        ffmpeg.streamRecording(req, res);
    } catch (err) {
        console.log('Error streaming video:', err);

        res.status(500).json({
            error: 'Unexpected error while trying to stream video.'
        });
    }
}


module.exports = {
    startRecording,
    stopRecording,
    fetchClips,
    fetchStatus,
    fetchClip,
    downloadClip,
    deleteClip,
    streamVideo
}
