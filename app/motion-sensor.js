module.exports = function enableMotionSensor(pin) {
    try {
        var pins = require('pi-pins');
        var backlight = require('rpi-backlight');
    } catch (e) {
        console.warn('Failed to load modules for motion sensor, ignoring', e);
        return;
    }

    var pidSensor = pins.connect(pin);
    pidSensor.mode('in')

    pidSensor.on('rise', () => {
        console.log('Motion detected');
        backlight.powerOn();
    });

    pidSensor.on('fall', () => {
        console.log('Motion lost');
        backlight.powerOff();
    });
}