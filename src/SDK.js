var Auth = require('./Auth.js'),
    Api  = require('./Api.js');

window.SP     = Auth;
window.SP.get = Api.get;

// Notify that the lib is ready
if (window._spOnReady) {
    window._spOnReady();
}
