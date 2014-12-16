
// TODO spostare redirect_uri alla connect?
// TODO aggiungere il supporto al parametro scope (defaults to "basic")
window.SP = function() {

    var BASE_URL  = { prod: "//www.spreaker.com", beta: "//www.spreaker-beta.com", dev: "//www.dev-spreaker.com" },
        AUTH_PATH = "/oauth2/authorize";

    var _config = {},
        _state  = {};


    function _getBaseUrl() {
        return BASE_URL[_config.env];
    }

    function _getAuthUrl(type) {
        return SP.Util.buildUrl(_getBaseUrl() + AUTH_PATH, { client_id: _config.app_id, response_type: type, state: _config.csrf, redirect_uri: _config.redirect_uri });
    }


    return {

        /**
         * Supported config:
         * - app_id         Required    Your application id
         * - redirect_uri   Optional    OAuth2 redirect uri
         *
         * @param  {Object} config
         */
        init: function(config) {

            // Check parameters
            if (!config.app_id) {
                throw new Error("The param 'app_id' is required.");
            }

            // Defaults
            config.env  = config.env || "prod";
            config.csrf = "" + Math.random();

            _config = config;
        },

        /**
         * Initiates auth flow.
         *
         * Supported options:
         * - callback  Optional    Function invoked on connect success
         * - type      Optional    "token" or "code" (defaults to token)
         *
         * @param  {Mixed} options
         */
        connect: function(options) {

            // Input can be an object or callback function
            if (typeof options === "function") {
                options = { callback: options };
            }

            // Update state
            _state.connect = options;

            // Open popup
            var width  = 600;
            var height = 400;
            var left   = window.screenX + (window.outerWidth - width) / 2;
            var top    = window.screenY + (window.outerHeight - height) / 2;

            _state.connect.window = window.open(_getAuthUrl(options.type || "token"), "", "left=" + left + ",top=" + top + ",height=" + height + ",width=" + width + ",toolbar=no,scrollbars=yes");
        },

        /**
         * Invoked by popup window on connect completed.
         */
        connectCallback: function() {

            if (!_state.connect) {
                return;
            }

            // Parse response
            var popup  = _state.connect.window;
            var params = SP.Util.parseUrlParams(popup.location.hash || popup.location.search);

            // Check CSRF
            if (!params.state) {
                throw new Error("Connect callback invoked, but 'state' is missing.");
            }
            if (params.state !== _config.csrf) {
                throw new Error("Connect callback invoked, but 'state' doesn't match.");
            }

            // Notify callback
            if (_state.connect.callback) {
                _state.connect.callback(params);
            }

            // Update state
            _state.connect = undefined;
        },

        // TODO
        disconnect: function() {


        }

    };

}();


// Notify loaded
// TODO


window.SP.Util = function() {


    return {

        /**
         * @param  {String} url
         * @param  {Object} params
         * @return {String}
         */
        // TODO test
        buildUrl: function(url, params) {

            // Add query string
            for (var name in params) {
                if (params.hasOwnProperty(name) && params[name] !== undefined) {
                    url += ((url.indexOf("?") === -1) ? '?' : '&') + name + "=" + encodeURIComponent(params[name]);
                }
            }

            return url;
        },

        /**
         * @param {String} params
         * @return {Object}
         */
        // TODO test
        parseUrlParams: function(params) {
            if (!params) {
                return {};
            }

            var parts = params.replace(/^(\?|#)/, '').split('&');
            var out   = {};

            for (var i = 0; i < parts.length; i++) {
                var name  = parts[i].substring(0, parts[i].indexOf("="));
                var value = decodeURIComponent(parts[i].substring(parts[i].indexOf("=") + 1));
                out[name] = value;
            }

            return out;
        }

    };

}();