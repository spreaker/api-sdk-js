
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