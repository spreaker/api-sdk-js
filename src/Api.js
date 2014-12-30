var Util = require('./Util.js');



// TODO env
function _getBaseUrl() {
    return "https://api.spreaker.com";
}


function _request(method, path, params, callback) {

    var data;
    var req = new XMLHttpRequest();

    req.open(method, Util.buildUrl(_getBaseUrl() + path, params), true);

    // Auth
    if (SP.getAccessToken()) {
        req.setRequestHeader("Authorization", "Bearer " + SP.getAccessToken());
    }

    // TODO auth
    // req.setRequestHeader("Content-Type", contentType);

    req.onreadystatechange = function(e) {
        if (e.target.readyState !== 4) {
            return;
        }

        // TODO gestire il caso di errore

        // Decode response
        var res = JSON.parse(e.target.responseText);

        // Notify
        callback(res.response, e.target);
    };

    return req.send(data);
}


module.exports = {

    get: function(path, params, callback) {
        return _request("GET", path, params, callback);
    }

    // TODO post, put, delete

};

