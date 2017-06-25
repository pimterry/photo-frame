module.exports = function enableMotionSensor(pin) {
    try {
        var pins = require('pi-pins');
        var backlight = require('rpi-backlight');
    } catch (e) {
        console.warn('Failed to load modules for motion sensor, ignoring', e);
        return;
    }

    var pirSensor = pins.connect(pin);
    pirSensor.mode('in')

    pirSensor.on('rise', () => {
        console.log('Motion detected');

        backlight.setBrightness(100);
    });

    pirSensor.on('fall', () => {
        console.log('Motion lost');

        backlight.setBrightness(0);
    });
}