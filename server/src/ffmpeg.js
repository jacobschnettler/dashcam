const fs = require('fs');
const path = require('path');

const { spawn } = require('child_process');
const { toggleRecording } = require('./state');
const { postProcessVideo } = require('./postprocess');

const { io } = require('./websocket');

let ffmpegProcess = null;

if (!fs.existsSync(process.env.OUTPUT)) {
    fs.mkdirSync(process.env.OUTPUT, { recursive: true });
}

function generateFilename(metadata) {
    return path.join(`${process.env.OUTPUT}/${metadata.date}`, `video.mp4`);
}

function startRecording(metadata) {
    return new Promise(function (resolve, reject) {
        if (ffmpegProcess) return;

        const videoDevice = '/dev/video0';

        const filename = generateFilename(metadata);

        console.log({ filename })

        try {
            // ffmpegProcess = spawn('ffmpeg', [
            //     '-f', 'v4l2',
            //     '-framerate', '60',
            //     '-video_size', '1920x1080',
            //     '-c:v', 'mjpeg',
            //     '-i', videoDevice,
            //     '-c:v', 'copy',
            //     filename
            // ]);

            // ffmpegProcess = spawn('ffmpeg', [
            //     '-f', 'v4l2',               // Input format
            //     '-framerate', '60',         // Frame rate
            //     '-video_size', '1920x1080', // Resolution
            //     '-i', videoDevice,          // Input device
            //     '-c:v', 'libx264',          // Encode with H.264
            //     '-preset', 'ultrafast',     // Set encoding speed/quality tradeoff
            //     '-pix_fmt', 'yuv420p',      // Ensure compatibility with most players
            //     filename                    // Output filename
            // ]);

            // ffmpegProcess = spawn('ffmpeg', [
            //     '-f', 'v4l2',               // Input format
            //     '-framerate', '60',         // Frame rate
            //     '-video_size', '1920x1080', // Resolution
            //     '-i', videoDevice,          // Input device
            //     '-c:v', 'vp8',              // Encode with VP8 for mp4
            //     '-b:v', '1M',               // Set video bitrate
            //     '-f', 'mp4',               // Force output format to mp4
            //     filename                    // Output filename with .mp4 extension
            // ]);

            ffmpegProcess = spawn('ffmpeg', [
                '-f', 'v4l2',               // Input format
                '-framerate', '60',         // Frame rate
                '-video_size', '1920x1080', // Resolution
                '-i', videoDevice,          // Input device
                '-c:v', 'h264_omx',         // Hardware-accelerated H.264 encoding
                '-b:v', '1M',               // Video bitrate
                '-f', 'mp4',                // Output format
                filename                    // Output filename
            ]);

            toggleRecording();

            ffmpegProcess.on('close', (code) => {
                if (code == 240) {
                    io.emit('alert', {
                        type: 'error',
                        label: 'Error! Device Busy.'
                    });
                } else {
                    postProcessVideo(metadata);
                }

                ffmpegProcess = null;

                toggleRecording();
            });

            resolve();
        } catch (err) {
            console.log(err)

            reject(err);
        }
    })
}

function stopRecording() {
    return new Promise(function (resolve, reject) {
        if (!ffmpegProcess) return reject()

        ffmpegProcess.kill('SIGINT');

        ffmpegProcess = null;

        resolve();
    })
}

function streamRecording(req, res) {
    res.writeHead(200, {
        "Content-Type": "video/mp4",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
    });

    // Start the ffmpeg process to capture the webcam feed and stream it as mp4
    const ffmpegProcess = spawn('ffmpeg', [
        '-f', 'v4l2',               // Input format for webcam capture
        '-framerate', '30',         // Set frame rate
        '-video_size', '1280x720',  // Set resolution
        '-i', '/dev/video0',        // Input device (change this to your webcam device)
        '-c:v', 'libvpx-vp9',       // Use VP9 codec for mp4
        '-preset', 'ultrafast',     // Use ultrafast preset for minimal latency
        '-pix_fmt', 'yuv420p',      // Pixel format
        '-f', 'mp4',               // Output format
        'pipe:1'                    // Output to stdout
    ]);

    // Pipe ffmpeg's stdout (video stream) to the response
    ffmpegProcess.stdout.pipe(res);

    // Handle errors
    ffmpegProcess.stderr.on('data', (data) => {
        console.error(`FFmpeg stderr: ${data}`);
    });

    ffmpegProcess.on('close', (code) => {
        console.log(`FFmpeg process exited with code ${code}`);
        res.end();
    });

    // Clean up the process if the client disconnects
    req.on('close', () => {
        ffmpegProcess.kill('SIGINT');
    });
}

module.exports = {
    startRecording,
    stopRecording,
    streamRecording
}