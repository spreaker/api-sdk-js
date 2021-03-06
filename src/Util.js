
module.exports = {

    /**
     * @param  {String} url
     * @param  {Object} params
     * @return {String}
     */
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
    parseUrlParams: function(params) {
        if (!params) {
            return {};
        }

        var parts = params.replace(/^(\?|#)/, '').split('&');
        var out   = {};

        for (var i = 0; i < parts.length; i++) {
            var name  = parts[i].substring(0, parts[i].indexOf("="));
            var value = decodeURIComponent(parts[i].substring(parts[i].indexOf("=") + 1)).replace(/\+/g, ' ');

            if (name) {
                out[name] = value;
            }
        }

        return out;
    }

};
