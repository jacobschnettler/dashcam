const { io } = require("./websocket");

var isRecording = false;
var metadata;

function setMetadata(data) {
    return metadata = data;
}

function fetchMetadata() {
    return metadata;
}

function fetchIsRecording() {
    return isRecording;
}

function toggleRecording() {
    var updatedBool = !isRecording;

    io.emit('setIsRecording', JSON.stringify(updatedBool));

    return isRecording = updatedBool;
}

module.exports = {
    fetchIsRecording,
    toggleRecording,
    setMetadata,
    fetchMetadata
}