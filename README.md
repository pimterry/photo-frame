# Photo Frame

A facebook photo frame app for Resin.io. Tested with:

* Raspberry Pi 3B
* [Rpi 7" screen](https://shop.pimoroni.com/products/raspberry-pi-7-touchscreen-display-with-frame)

## Getting started

- Set up your device and screen
- Create a facebook app, add the 'facebook login' product, and enable 'Login from devices'
- Sign up on [resin.io](https://dashboard.resin.io/signup), create an application for your device, and provision it
- Set the following environmental variables:
    * RESIN_HOST_CONFIG_gpu_mem: 120 // Sets the GPU memory for the device
    * RESIN_HOST_CONFIG_lcd_rotate: 2 // Rotates the screen 180 degrees
    * FB_APP_ID: [your facebook app id]
    * FB_CLIENT_TOKEN: [your facebook client token]
- Push the contents of this repo to your Resin.io application
- Once the device updates, it should follow the [device flow](https://developers.facebook.com/docs/facebook-login/for-devices) to log into Facebook, and start showing your photos