const fs = require('fs')

const ffmpeg = require('fluent-ffmpeg');

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

async function postProcessVideo(metadata) {
    const dir = metadata.date;

    const files = await fs.readdirSync(`${process.env.OUTPUT}/${dir}`)

    var video;

    for (let i = 0; i < files.length; i++) {
        const file = files[i];

        switch (file) {
            case 'video.mp4':
                video = `${process.env.OUTPUT}/${dir}/video.mp4`;

                break;
        }
    }

    try {
        await extractThumbnail(video, `${dir}/thumbnail.png`);
    } catch (err) {

    }

    const updatedMetadata = {
        ...metadata,
        video: `${dir}/video.mp4`,
        thumbnail: `${dir}/thumbnail.png`,
        length: await getVideoDuration(video),
        finished: true
    }

    await fs.writeFileSync(
        `${process.env.OUTPUT}/${dir}/metadata.json`,
        JSON.stringify(updatedMetadata),
        'utf-8'
    );
}

module.exports = {
    postProcessVideo
}