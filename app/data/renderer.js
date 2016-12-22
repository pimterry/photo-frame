const {ipcRenderer} = require('electron');

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

getToken().then((fbToken) => {
    console.log('Got token', fbToken);

    if (fbToken) {
        console.log(`Showing photos with token ${fbToken}`);
    } else {
        console.log('logging in');
        return setToken('123');
    }
});
