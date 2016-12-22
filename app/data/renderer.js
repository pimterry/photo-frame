const {ipcRenderer} = require('electron');

const log = (...args) => ipcRenderer.send('log', ...args);
const getToken = () => fetch("/get-fb-token").then((response) => {
    if (response.status === 200) {
        return response.json().then((json) => json.token);
    } else return null;
});

const setToken = (token) => fetch("/set-fb-token", {
    method: 'post',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ token })
});

log('Frame initialising');

getToken().then((fbToken) => {
    log('Got token', fbToken);

    if (fbToken) {
        log(`Showing photos with token ${fbToken}`);
    } else {
        log('logging in');
        return setToken('123');
    }
});
