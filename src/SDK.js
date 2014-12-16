var Auth = require('./Auth.js');

window.SP = Auth;

// Notify that the lib is ready
if (window._spOnReady) {
    window._spOnReady();
}
