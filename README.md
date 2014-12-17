# Spreaker API SDK - Javascript

### CDN

The latest stable release of the JS SDK is hosted on CloudFront CDN at the following urls. Please load the SDK from these urls instead of serving it from your own webserver, so that fixed get automatically applied once release:

[http://d1sojsgu0jwtb7.cloudfront.net/sdk/js/spreaker.js]()
[http://d1sojsgu0jwtb7.cloudfront.net/sdk/js/spreaker.js.gz]()

[https://d1sojsgu0jwtb7.cloudfront.net/sdk/js/spreaker.js]()
[https://d1sojsgu0jwtb7.cloudfront.net/sdk/js/spreaker.js.gz]()


### Authentication (OAuth2)

This library provides methods to easily authenticate on Spreaker from a 3rd party website / app. Checkout the `example/` folder and get more details at [http://developers.spreaker.com]().


### Supported Browsers

 * IE8+
 * Chrome
 * Firefox
 * Safari
 * Opera


### Help

Do you need help? Open an issue or contact us at [http://help.spreaker.com]().


### Contribute

#### Setup

Install `browserify`, `gulp`, `serve` and local node modules:

```bash
sudo npm install -g browserify
sudo npm install -g gulp
sudo npm install -g serve
sudo npm install -g wr
npm install
```

Run `serve` and automatically build the library on src/ changes:

```bash
wr "gulp build" src/
serve .
```

Open your browser at [http://localhost:3000/example/auth_sync.html](http://localhost:3000/example/auth_sync.html)


#### Tests

Run tests:

```bash
npm test
```


#### Release

Build the library for production:

```bash
gulp release
```
