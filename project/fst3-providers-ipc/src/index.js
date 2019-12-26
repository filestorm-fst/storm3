const _ = require('underscore');
const errors = require('../../fst3-core-helpers/export').errors;
const oboe = require('oboe');


const IpcProvider = function IpcProvider(path, net) {
  let _this = this;
  this.responseCallbacks = {};
  this.notificationCallbacks = [];
  this.path = path;
  this.connected = false;

  this.connection = net.connect({path: this.path});

  this.addDefaultEvents();

  // LISTEN FOR CONNECTION RESPONSES
  let callback = function (result) {
    /*jshint maxcomplexity: 6 */

    let id = null;

    // get the id which matches the returned id
    if (_.isArray(result)) {
      result.forEach(function (load) {
        if (_this.responseCallbacks[load.id])
          id = load.id;
      });
    } else {
      id = result.id;
    }

    // notification
    if (!id && result.method.indexOf('_subscription') !== -1) {
      _this.notificationCallbacks.forEach(function (callback) {
        if (_.isFunction(callback))
          callback(result);
      });

      // fire the callback
    } else if (_this.responseCallbacks[id]) {
      _this.responseCallbacks[id](null, result);
      delete _this.responseCallbacks[id];
    }
  };

  // use oboe.js for Sockets
  if (net.constructor.name === 'Socket') {
    oboe(this.connection)
      .done(callback);
  } else {
    this.connection.on('data', function (data) {
      _this._parseResponse(data.toString()).forEach(callback);
    });
  }
};

/**
 Will add the error and end event to timeout existing calls

 @method addDefaultEvents
 */
IpcProvider.prototype.addDefaultEvents = function () {
  let _this = this;

  this.connection.on('connect', function () {
    _this.connected = true;
  });

  this.connection.on('close', function () {
    _this.connected = false;
  });

  this.connection.on('error', function () {
    _this._timeout();
  });

  this.connection.on('end', function () {
    _this._timeout();
  });

  this.connection.on('timeout', function () {
    _this._timeout();
  });
};


/**
 Will parse the response and make an array out of it.

 NOTE, this exists for backwards compatibility reasons.

 @method _parseResponse
 @param {String} data
 */
IpcProvider.prototype._parseResponse = function (data) {
  let _this = this,
    returnValues = [];

  // DE-CHUNKER
  let dechunkedData = data
    .replace(/\}[\n\r]?\{/g, '}|--|{') // }{
    .replace(/\}\][\n\r]?\[\{/g, '}]|--|[{') // }][{
    .replace(/\}[\n\r]?\[\{/g, '}|--|[{') // }[{
    .replace(/\}\][\n\r]?\{/g, '}]|--|{') // }]{
    .split('|--|');

  dechunkedData.forEach(function (data) {

    // prepend the last chunk
    if (_this.lastChunk)
      data = _this.lastChunk + data;

    let result = null;

    try {
      result = JSON.parse(data);

    } catch (e) {

      _this.lastChunk = data;

      // start timeout to cancel all requests
      clearTimeout(_this.lastChunkTimeout);
      _this.lastChunkTimeout = setTimeout(function () {
        _this._timeout();
        throw errors.InvalidResponse(data);
      }, 1000 * 15);

      return;
    }

    // cancel timeout and set chunk to null
    clearTimeout(_this.lastChunkTimeout);
    _this.lastChunk = null;

    if (result)
      returnValues.push(result);
  });

  return returnValues;
};


/**
 Get the adds a callback to the responseCallbacks object,
 which will be called if a response matching the response Id will arrive.

 @method _addResponseCallback
 */
IpcProvider.prototype._addResponseCallback = function (payload, callback) {
  let id = payload.id || payload[0].id;
  let method = payload.method || payload[0].method;

  this.responseCallbacks[id] = callback;
  this.responseCallbacks[id].method = method;
};

/**
 Timeout all requests when the end/error event is fired

 @method _timeout
 */
IpcProvider.prototype._timeout = function () {
  for (let key in this.responseCallbacks) {
    if (this.responseCallbacks.hasOwnProperty(key)) {
      this.responseCallbacks[key](errors.InvalidConnection('on IPC'));
      delete this.responseCallbacks[key];
    }
  }
};

/**
 Try to reconnect

 @method reconnect
 */
IpcProvider.prototype.reconnect = function () {
  this.connection.connect({path: this.path});
};


IpcProvider.prototype.send = function (payload, callback) {
  // try reconnect, when connection is gone
  if (!this.connection.writable)
    this.connection.connect({path: this.path});


  this.connection.write(JSON.stringify(payload));
  this._addResponseCallback(payload, callback);
};

/**
 Subscribes to provider events.provider

 @method on
 @param {String} type    'notification', 'connect', 'error', 'end' or 'data'
 @param {Function} callback   the callback to call
 */
IpcProvider.prototype.on = function (type, callback) {

  if (typeof callback !== 'function')
    throw new Error('The second parameter callback must be a function.');

  switch (type) {
    case 'data':
      this.notificationCallbacks.push(callback);
      break;

    // adds error, end, timeout, connect
    default:
      this.connection.on(type, callback);
      break;
  }
};

/**
 Subscribes to provider events.provider

 @method on
 @param {String} type    'connect', 'error', 'end' or 'data'
 @param {Function} callback   the callback to call
 */
IpcProvider.prototype.once = function (type, callback) {

  if (typeof callback !== 'function')
    throw new Error('The second parameter callback must be a function.');

  this.connection.once(type, callback);
};

/**
 Removes event listener

 @method removeListener
 @param {String} type    'data', 'connect', 'error', 'end' or 'data'
 @param {Function} callback   the callback to call
 */
IpcProvider.prototype.removeListener = function (type, callback) {
  let _this = this;

  switch (type) {
    case 'data':
      this.notificationCallbacks.forEach(function (cb, index) {
        if (cb === callback)
          _this.notificationCallbacks.splice(index, 1);
      });
      break;

    default:
      this.connection.removeListener(type, callback);
      break;
  }
};

/**
 Removes all event listeners

 @method removeAllListeners
 @param {String} type    'data', 'connect', 'error', 'end' or 'data'
 */
IpcProvider.prototype.removeAllListeners = function (type) {
  switch (type) {
    case 'data':
      this.notificationCallbacks = [];
      break;

    default:
      this.connection.removeAllListeners(type);
      break;
  }
};

/**
 Resets the providers, clears all callbacks

 @method reset
 */
IpcProvider.prototype.reset = function () {
  this._timeout();
  this.notificationCallbacks = [];

  this.connection.removeAllListeners('error');
  this.connection.removeAllListeners('end');
  this.connection.removeAllListeners('timeout');

  this.addDefaultEvents();
};

/**
 * Returns the desired boolean.
 *
 * @method supportsSubscriptions
 * @returns {boolean}
 */
IpcProvider.prototype.supportsSubscriptions = function () {
  return true;
};

module.exports = IpcProvider;
