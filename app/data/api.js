const {ipcRenderer} = require('electron');

exports.log = (...args) => ipcRenderer.send('log', ...args);

exports.getToken = () => fetch('/get-fb-token').then((response) => {
    if (response.status === 200) {
        return response.json().then((json) => json.token);
    } else return null;
});

exports.startDeviceLogin = () => fetch('/start-device-login', {
    method: 'post',
}).then((response) => response.json());

exports.checkDeviceLoginStatus = (loginData) => fetch('/check-device-login-status', {
    method: 'post',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ code: loginData.code })

}).then((response) => response.json());

exports.setToken = (token) => fetch('/set-fb-token', {
    method: 'post',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ token })
});