'use strict';

const { app, BrowserWindow } = require('electron');

const PORT = 8080

app.on('ready', () => {
    let window = new BrowserWindow({
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

    if (process.env.URL_LAUNCHER_CONSOLE) {
        window.openDevTools();
    }

    require('./server.js').start(PORT).then(() => {
        window.loadURL(`http://localhost:${PORT}/`);
    });
});