
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
            close(id);
        }
    }, 100);
}

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
function open(url, options) {

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
}

/**
 * Closes a popup window.
 *
 * @param {Number} id
 */
function close(id) {

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
}

/**
 * @param  {Number} id
 * @return {Window}
 */
function getWindow(id) {

    return popups[id] && popups[id].win;
}


module.exports = {
    open:       open,
    close:      close,
    getWindow:  getWindow
};
