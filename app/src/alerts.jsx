// Alerts Manager

import { useEffect } from "react"
import { toast } from 'react-toastify';

import { TOAST_CONFIG } from './utils'

import { io } from 'socket.io-client';

export function AlertsManager({ isRecording }) {
    const [IsRecording, setIsRecording] = isRecording;

    useEffect(function () {
        const socket = io();

        socket.on('alert', ({ type, label }) => {
            switch (type) {
                case 'success':
                    toast.success(label, TOAST_CONFIG);

                    break;

                case 'error':
                    toast.error(label, TOAST_CONFIG);

                    break;
            }
        });

        socket.on('setIsRecording', (isRecording) => {
            setIsRecording(JSON.parse(isRecording));
        });
    }, []);

    return (
        <div />
    )
}