
window.SP = function() {

    // Static config
    var BASE_URL  = { prod: "//www.spreaker.com", beta: "//www.spreaker-beta.com", dev: "//www.dev-spreaker.com" },
        AUTH_PATH = "/oauth2/authorize";

    // User config
    var _config = {};


    function _getBaseUrl() {
        return BASE_URL[_config.env];
    }

    function _getAuthUrl(type) {
        return SP.Util.buildUrl(_getBaseUrl() + AUTH_PATH, { client_id: _config.app_id, response_type: type, state: _config.csrf });
    }


    return {

        /**
         * Supported config:
         * - app_id     Required    Your application id
         *
         * @param  {Object} config
         */
        init: function(config) {

            // Check parameters
            if (!config.app_id) {
                throw new Error("The param 'app_id' is required");
            }

            // Defaults
            config.env  = config.env || "prod";
            config.csrf = Math.random();

            _config = config;
        },

        /**
         * Initiates auth flow.
         *
         * Supported options:
         * - connected  Optional    Function invoked on connect success
         * - type       Optional    "token" or "code" (defaults to token)
         *
         * @param  {Mixed} options
         */
        connect: function(options) {

            // Input can be an object or callback function
            if (typeof options === "function") {
                options = { connected: optionsOrCallback };
            }

            // Open popup
            var left  = window.screenX + (window.outerWidth - options.width) / 2;
            var top   = window.screenY + (window.outerHeight - options.height) / 2;
            var popup = window.open(_getAuthUrl(options.type || "token"), "", "left=" + left + ",top=" + top + ",height=400,width=600,toolbar=no,scrollbars=yes");
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
        buildUrl: function(url, params) {

            // Add query string
            for (var name in params) {
                if (params.hasOwnProperty(name)) {
                    url += ((url.indexOf("?") === -1) ? '?' : '&') + name + "=" + encodeURIComponent(params[name]);
                }
            }

            return url;
        }

    };

}();