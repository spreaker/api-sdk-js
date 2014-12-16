# Spreaker API SDK - Javascript


### Supported Browsers

 * IE8+
 * Chrome
 * Firefox
 * Safari
 * Opera


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

Open your browser at [http://localhost:3000/example/auth.html](http://localhost:3000/example/auth.html)


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
