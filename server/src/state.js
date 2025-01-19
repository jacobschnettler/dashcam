var isRecording = false;

var metadata

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
    return isRecording = !isRecording;
}

module.exports = {
    fetchIsRecording,
    toggleRecording,
    setMetadata,
    fetchMetadata
}