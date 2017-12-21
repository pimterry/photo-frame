'use strict';

const activateMotionSensor = require('./motion-sensor');
const path = require('path')
const { app, BrowserWindow, ipcMain } = require('electron');

const PIR_PIN = 7;
const PORT = 8080;

app.on('ready', () => {
    let window = new BrowserWindow({
        width: 800,
        height: 480,
        frame: false,
        title: "Photo frame"
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
        window.loadURL("file://" + path.join(__dirname, "data/index.html"));
    });

    if (process.env.ENABLE_MOTION_SENSOR) {
      activateMotionSensor(PIR_PIN);
    }
});

app.commandLine.appendSwitch('touch-events', 'enabled');
ipcMain.addListener('log', (event, ...args) => console.log(...args));
