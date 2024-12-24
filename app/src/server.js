const express = require('express')
const app = express()

const path = require('path');

app.use(express.static(path.join(__dirname, '../build')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.get('/api', function (req, res) {
    res.sendStatus(200)
})

app.listen(4000, function () {
    console.log("Dashboard started.\nPort: 4000")
})