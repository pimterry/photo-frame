const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();

app.use(express.static('data'));
app.use(require('body-parser').json());

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'data/index.html'));
})

const TOKEN_FILE = process.env.TOKEN_FILE || "/data/fb-token";
let token = fs.existsSync(TOKEN_FILE) ? fs.readFileSync(TOKEN_FILE, 'utf8') : null;

app.get('/get-fb-token', (req, res) => {
    if (token) {
        res.set('content-type', 'application/json');
        res.status(200).send(JSON.stringify({ token }));
    } else {
        res.sendStatus(404);
    }
});

app.post('/set-fb-token', (req, res) => {
    let newToken = req.body.token;
    if (newToken) {
        fs.writeFileSync(TOKEN_FILE, newToken, { encoding: 'utf8' });
    } else {
        fs.unlinkSync(TOKEN_FILE);
    }
    token = newToken;
    res.sendStatus(200);
});

exports.start = function (port) {
    return new Promise((resolve, reject) => {
        app.listen(port, function () {
            console.log('Example app listening on port ' + port);
            resolve();
        });
    });
}