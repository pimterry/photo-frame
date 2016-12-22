{
    'use strict';

    const { app, BrowserWindow } = require('electron');
    const path = require('path');

    let window = null;

    /*
      we initialize our application display as a callback of the electronJS "ready" event
    */
    app.on('ready', () => {

        // here we actually configure the behavour of electronJS
        window = new BrowserWindow({
            width: 800,
            height: 480,
            frame: false,
            title: "Photo frame",
        });

        window.webContents.on('did-finish-load', () => {
            setTimeout(() => {
                window.show();
            }, 300);
        });

        // if the env-var is set to true, a portion of the screen will be dedicated to the chrome-dev-tools
        if (process.env.URL_LAUNCHER_CONSOLE) {
            window.openDevTools();
        }

        // the big red button, here we go
        window.loadURL("file://" + path.join(__dirname, "data/index.html"));
    });
}
