# Photo Frame

This is the complete setup for a facebook photo frame app, for Raspberry PI + Resin.io.

It gets every photo you've ever uploaded or been tagged in on Facebook, shuffles them, rotates through one every 30 seconds (or you can swipe left and right between them), and updates the list when it gets to the end.

Logs into facebook with device flow: shows a code on the frame, enter it into facebook.com/device and it'll be magically authenticated, super easy to use.

Also supports optional automatic backlight control, with a PIR motion sensor.

Tested with:

* Raspberry Pi 3B
* [Rpi 7" screen](https://shop.pimoroni.com/products/raspberry-pi-7-touchscreen-display-with-frame)
* [HC-SR501 infrared motion sensor](https://www.modmypi.com/electronics/sensors/pir-infrared-motion-sensor-hc-sr501-) (optional)

## Getting started

- Set up your device and screen
    * To add the motion sensor attach the 5V and GND pins, then connect the sensor output to **gpio pin 7** (physical pin 26) on your pi.
    * Sensitivity and delay are controllable on the sensor itself.
- Sign up for free on [resin.io](https://dashboard.resin.io/signup), create an application for your device, and provision it. You should see the Resin logo and boot sequence on your screen.
- Create a facebook app, add the 'facebook login' product, and enable 'Login from devices'
    * Unless you want to go through Facebook's app review process, you'll need to add every prospective user of your device as an admin, tester or developer (under 'Roles')
- Set the following environmental variables for your Resin application:
    * RESIN_HOST_CONFIG_gpu_mem: 120 // Sets the GPU memory for the device
    * RESIN_HOST_CONFIG_lcd_rotate: 2 // Rotates the screen 180 degrees
    * FB_APP_ID: [your facebook app id]
    * FB_CLIENT_TOKEN: [your facebook client token]
- Push the contents of this repo to your Resin.io application
- Once the device updates, it will walk you through the [device flow](https://developers.facebook.com/docs/facebook-login/for-devices) to get photo access to your Facebook account, and then start showing your photos.

Login persists indefinitely over future boots. You can reset the auth token to change the user by clicking 'Purge Data' in Resin.io.

Currently doesn't handle token expiry - you'll probably have to purge & login again after 60 days. If that's too annoying, PRs are very welcome.
