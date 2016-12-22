const {ipcRenderer} = require('electron');

window.api = {
    log: (...args) => ipcRenderer.send('log', ...args),

    getToken: () => fetch('/get-fb-token').then((response) => {
        if (response.status === 200) {
            return response.json().then((json) => json.token);
        } else return null;
    }),

    startDeviceLogin: () => fetch('/start-device-login', {
        method: 'post',
    }).then((response) => response.json()),

    setToken: (token) => fetch('/set-fb-token', {
        method: 'post',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ token })
    })
}