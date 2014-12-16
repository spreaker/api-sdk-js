var Auth = require('./Auth.js');

window.SP = Auth;

// Execute queued commands (async version)
if (_sp) {

    for (var i = 0; i < _sp.length; i++) {
        var fn   = _sp[i][0];
        var args = _sp[i].splice(1);

        window.SP[fn].apply(window.SP, args);
    }
}
