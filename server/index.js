require('dotenv').config();

const express = require('express');
const app = express();

const fs = require('fs');
const path = require('path');

const { spawn } = require('child_process');

let ffmpegProcess = null;

const outputFolder = path.join(__dirname, 'output');
if (!fs.existsSync(outputFolder)) {
  fs.mkdirSync(outputFolder, { recursive: true });
}

app.use('/output', express.static(outputFolder));

app.get('/', function (req, res) {
  res.send(
    `<a href='/start'>Start Recording</a><br>
    <a href='/stop'>Stop Recording</a><br>
    <a href='/clips'>View Clips</a>`
  );
});

function generateFilename() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  return path.join(outputFolder, `${timestamp}.mov`);
}

app.get('/start', function (req, res) {
  if (ffmpegProcess) {
    return res.send('Recording is already in progress.');
  }

  const videoDevice = '/dev/video0';

  const filename = generateFilename();

  ffmpegProcess = spawn('ffmpeg', [
    '-f', 'v4l2',
    '-framerate', '60',
    '-video_size', '1920x1080',
    '-c:v', 'mjpeg',
    '-i', videoDevice,
    '-c:v', 'copy',
    filename
  ]);

  ffmpegProcess.stdout.on('data', (data) => {
    console.log(`FFmpeg stdout: ${data}`);
  });

  ffmpegProcess.stderr.on('data', (data) => {
    console.error(`FFmpeg stderr: ${data}`);
  });

  ffmpegProcess.on('close', (code) => {
    console.log(`FFmpeg process exited with code ${code}`);
    ffmpegProcess = null;
  });

  res.send(`Recording started. Saving to: ${filename}`);
});

app.get('/stop', function (req, res) {
  if (!ffmpegProcess) {
    return res.send('No recording is in progress.');
  }

  ffmpegProcess.kill('SIGINT');
  ffmpegProcess = null;

  res.send('Recording stopped.');
});

app.get('/clips', function (req, res) {
  fs.readdir(outputFolder, (err, files) => {
    if (err) {
      return res.status(500).send('Error reading clips folder.');
    }

    const clips = files.filter(file => file.endsWith('.mov'));

    if (clips.length === 0) {
      return res.send('No clips available.');
    }

    let clipsList = '<h1>Available Clips</h1><ul>';
    clips.forEach(clip => {
      const clipUrl = `/output/${clip}`;
      clipsList += `<li><a href="${clipUrl}" download="${clip}">${clip}</a></li>`;
    });
    clipsList += '</ul>';

    res.send(clipsList);
  });
});

app.get('/output/:file', (req, res) => {
  const filePath = path.join(outputFolder, req.params.file);
  if (fs.existsSync(filePath)) {
    res.download(filePath);
  } else {
    res.status(404).send('File not found');
  }
});

app.listen(process.env.PORT, function () {
  console.log(`Server started on port ${process.env.PORT}`);
});

