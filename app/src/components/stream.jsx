import React, { useEffect, useRef } from 'react';

export const WebcamStream = () => {
    const videoRef = useRef(null);

    useEffect(() => {
        const video = videoRef.current;
        const url = 'http://localhost:4000/api/stream'; // The backend route to stream the video

        // Set up the video element to continuously stream
        video.src = url;
        video.autoplay = true;
        video.controls = true;

        // Optional: you can add event listeners if needed, like 'playing', 'paused', etc.
        video.addEventListener('play', () => {
            console.log('Video started playing');
        });

        return () => {
            video.removeEventListener('play', () => console.log('Video started playing'));
        };
    }, []);

    return (
        <div>
            <video ref={videoRef} />
        </div>
    );
};
