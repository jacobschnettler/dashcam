const fs = require('fs')

const path = require('path'); 

const ffmpeg = require('fluent-ffmpeg');

const { exec } = require('child_process');

const getVideoDuration = (videoPath) => {
    return new Promise((resolve, reject) => {
        ffmpeg.ffprobe(videoPath, (err, metadata) => {
            if (err) {
                reject(`Error retrieving video metadata: ${err.message}`);
            } else {
                const durationInSeconds = metadata.format.duration;
                // Convert to minutes:seconds
                const minutes = Math.floor(durationInSeconds / 60);
                const seconds = Math.floor(durationInSeconds % 60).toString().padStart(2, '0');
                resolve(`${minutes}:${seconds}`);
            }
        });
    });
};

const extractThumbnail = (videoPath, thumbnailPath) => {
    console.log(videoPath)

    return new Promise((resolve, reject) => {
        ffmpeg(videoPath)
            .screenshots({
                timestamps: ['00:00:05.000'], // Try to capture at 5 seconds
                filename: thumbnailPath,
                folder: process.env.OUTPUT,
                size: '320x240'
            })
            .on('end', resolve)
            .on('error', (err) => reject(`Error capturing thumbnail: ${err.message}`));
    });
};

async function flipVideo(inputPath, outputPath) {
    return new Promise((resolve, reject) => {
        const command = `ffmpeg -i "${inputPath}" -vf "transpose=2,transpose=2" "${outputPath}"`;

        exec(command, (err, stdout, stderr) => {
            if (err) {
                return reject(`Error flipping video: ${stderr || err.message}`);
            }
            resolve(stdout);
        });
    });
}

async function postProcessVideo(metadata) {
    try {
        const dir = metadata.date;

        const files = await fs.readdirSync(`${process.env.OUTPUT}/${dir}`)

        var video;

        for (let i = 0; i < files.length; i++) {
            const file = files[i];

            switch (file) {
                case 'video.webm':
                    video = `${process.env.OUTPUT}/${dir}/video.webm`;

                    break;
            }
        }

        try {
            // video rotation
            await flipVideo(video, path.join( `${process.env.OUTPUT}/${dir}`, 'rotated.webm'));

            await fs.rmSync(path.join( `${process.env.OUTPUT}/${dir}`, 'video.webm'));

            await fs.renameSync(path.join( `${process.env.OUTPUT}/${dir}`, 'rotated.webm'), path.join( `${process.env.OUTPUT}/${dir}`, 'video.webm'))
        } catch (err) {
            console.error('Error flipping video:', err);
        }

        try {
            await extractThumbnail(video, `${dir}/thumbnail.png`);
        } catch (err) {
            console.log(err)
        }

        try {
            const updatedMetadata = {
                ...metadata,
                video: `${dir}/video.webm`,
                thumbnail: `${dir}/thumbnail.png`,
                length: await getVideoDuration(video),
                finished: true
            }

            await fs.writeFileSync(
                `${process.env.OUTPUT}/${dir}/metadata.json`,
                JSON.stringify(updatedMetadata),
                'utf-8'
            );
        } catch (err) {
            console.log(err)
        }
    } catch (err) {
        console.log(err)
    }
}

module.exports = {
    postProcessVideo
}