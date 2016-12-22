const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const FormData = require('form-data');

const express = require('express');
const app = express();

app.use(express.static('data'));
app.use(require('body-parser').json());

const FB_ACCESS_TOKEN = process.env.FB_APP_ID + "|" + process.env.FB_CLIENT_TOKEN;
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

app.post('/start-device-login', (req, res) => {
    const fbParams = new FormData();
    fbParams.append('access_token', FB_ACCESS_TOKEN);
    fbParams.append('scope', 'public_profile,user_photos');

    fetch('https://graph.facebook.com/v2.6/device/login', {
        method: 'post',
        body: fbParams
    }).then((response) => response.json()).then((data) => {
        res.set('content-type', 'application/json');
        res.status(200).send(JSON.stringify(data));
    }).catch((err) => {
        console.error(err);
        res.sendStatus(500);
    });
});

app.post('/check-device-login-status', (req, res) => {
    const fbParams = new FormData();
    fbParams.append('access_token', FB_ACCESS_TOKEN);
    fbParams.append('code', req.body.code);

    fetch('https://graph.facebook.com/v2.6/device/login_status', {
        method: 'post',
        body: fbParams
    }).then((response) => response.json()).then((data) => {
        res.set('content-type', 'application/json');
        res.status(200).send(JSON.stringify(data));
    }).catch((err) => {
        console.error(err);
        res.sendStatus(500);
    });
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