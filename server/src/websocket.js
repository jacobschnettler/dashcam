const { server } = require('./server');

const socketIo = require('socket.io');

const io = socketIo(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
        allowedHeaders: ['auth-header'],
        credentials: true
    }
});

module.exports = {
    io
}