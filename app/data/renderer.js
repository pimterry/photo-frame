api.log('Frame initialising');

api.getToken().then((fbToken) => {
    api.log('Got token', fbToken);

    if (fbToken) {
        api.log(`Showing photos with token ${fbToken}`);
    } else {
        return authorizeUser();
    }
});

function authorizeUser() {
    return api.startDeviceLogin().then((loginData) => {
        alert("Code: " + loginData.user_code);
    });
}
