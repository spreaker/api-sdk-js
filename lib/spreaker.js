
// TODO detectare quando la popup viene chiusa senza completare il flusso
window.SP = function() {

    var BASE_URL  = { prod: "//www.spreaker.com", beta: "//www.spreaker-beta.com", dev: "//www.dev-spreaker.com" },
        AUTH_PATH = "/oauth2/authorize";

    var _config  = {},
        _connect,
        _token;


    function _getBaseUrl() {
        return BASE_URL[_config.env];
    }

    function _getAuthUrl(type, scope) {
        return SP.Util.buildUrl(_getBaseUrl() + AUTH_PATH, {
            client_id:      _config.app_id,
            response_type:  type,
            state:          _config.csrf,
            scope:          scope,
            redirect_uri:   _config.redirect_uri
        });
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
         * - callback  Optional    Function invoked on auth flow completed (either success and failure)
         * - type      Optional    "token" or "code" (defaults to token)
         * - scope     Optional    Defaults to "basic"
         *
         * @param  {Mixed} options
         */
        connect: function(options) {

            // Input can be an object or callback function
            if (typeof options === "function") {
                options = { callback: options };
            }

            // Update state
            _connect = options;

            // Open popup
            _connect.popup_id = SP.Popup.open(_getAuthUrl(options.type || "token", options.scope || "basic"), {
                width:  600,
                height: 400,
                closed: SP.connectCallback
            });
        },

        /**
         * Invoked by popup window on connect completed.
         */
        connectCallback: function() {

            if (!_connect) {
                return;
            }

            // Get data
            var popup_id = _connect.popup_id;
            var callback = _connect.callback;

            // Update state
            _connect = undefined;

            // Parse response
            var res, win = SP.Popup.getWindow(popup_id);
            if (win) {
                res = SP.Util.parseUrlParams(win.location.hash || win.location.search);
            } else {
                res = { state: _config.csrf, error: "canceled", error_description: "The user closed the popup." };
            }

            // Check CSRF
            if (!res.state) {
                throw new Error("Connect callback invoked, but 'state' is missing.");
            }
            if (res.state !== _config.csrf) {
                throw new Error("Connect callback invoked, but 'state' doesn't match.");
            }

            // Save access token
            _token = res.access_token || undefined;

            // Close popup
            SP.Popup.close(popup_id);

            // Notify callback
            if (callback) {
                callback(res);
            }
        },

        connectCanceled: function() {
            // TODO
            alert("canceled");
        },

        disconnect: function() {

            // Reset token
            _token = undefined;
        }

    };

}();


// Notify loaded
// TODO


window.SP.Popup = function() {

    var popups  = {},
        next_id = 1;

    function _isWindowClosed(win) {
        // HACK for Opera: the "closed" property after window close sometimes was:
        // - undefined
        // - inaccessible (raise a SecurityError)
        try {
            return !win || win.closed !== false;
        } catch(err) {
            return true;
        }
    }

    function _stopMonitoring(id) {

        if (popups[id].timer) {
            clearInterval(popups[id].timer);
            popups[id].timer = undefined;
        }
    }

    function _startMonitoring(id) {

        popups[id].timer = setInterval(function() {
            if (_isWindowClosed(popups[id].win)) {
                SP.Popup.close(id);
            }
        }, 100);
    }

    return {

        /**
         * Opens a new popup window.
         *
         * Supported options:
         * - width
         * - height
         * - name
         * - closed     Function invoked on popup closed
         *
         * @param  {String} url
         * @param  {Object} options
         * @return {Number}
         */
        open: function(url, options) {

            // Init
            var width  = options.width || 600;
            var height = options.height || 400;
            var left   = window.screenX + (window.outerWidth - width) / 2;
            var top    = window.screenY + (window.outerHeight - height) / 2;

            // Open
            var win = window.open(url, options.name || "", "left=" + left + ",top=" + top + ",height=" + height + ",width=" + width + ",toolbar=no,scrollbars=yes");

            // Save popup
            var id = next_id++;

            popups[id] = {
                win:     win,
                options: options
            };

            // Start monitoring
            _startMonitoring(id);

            return id;
        },

        /**
         * Closes a popup window.
         *
         * @param {Number} id
         */
        close: function(id) {

            if (!popups[id]) {
                return;
            }

            _stopMonitoring(id);

            // Close window
            if (popups[id].win && !_isWindowClosed(popups[id].win)) {
                popups[id].win.close();
            }

            // Delete ref
            var callback = popups[id].options.closed;
            popups[id] = undefined;

            // Notify
            if (callback) {
                callback();
            }
        },

        /**
         * @param  {Number} id
         * @return {Window}
         */
        getWindow: function(id) {

            return popups[id] && popups[id].win;
        }

    };

}();


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
                var value = decodeURIComponent(parts[i].substring(parts[i].indexOf("=") + 1)).replace(/\+/g, ' ');
                out[name] = value;
            }

            return out;
        }

    };

}();