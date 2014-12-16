
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
         * Invoked by popup window on connect flow completed or popup closed.
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

        disconnect: function() {

            // Reset token
            _token = undefined;
        }

    };

}();


// Notify loaded
// TODO
