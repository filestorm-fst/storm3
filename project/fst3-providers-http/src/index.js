const errors = require('../../fst3-core-helpers/export').errors;
const XHR2 = require('xhr2-cookies').XMLHttpRequest; // jshint ignore: line
const http = require('http');
const https = require('https');


/**
 * HttpProvider should be used to send rpc calls over http
 */
const HttpProvider = function HttpProvider(host, options) {
  options = options || {};

  let keepAlive = (options.keepAlive === true || options.keepAlive !== false);
  this.host = host || 'http://localhost:8545';
  if (this.host.substring(0, 5) === 'https') {
    this.httpsAgent = new https.Agent({keepAlive: keepAlive});
  } else {
    this.httpAgent = new http.Agent({keepAlive: keepAlive});
  }

  this.withCredentials = options.withCredentials || false;
  this.timeout = options.timeout || 0;
  this.headers = options.headers;
  this.connected = false;
};

HttpProvider.prototype._prepareRequest = function () {
  let request;

  // the current runtime is a browser
  if (typeof XMLHttpRequest !== 'undefined') {
    request = new XMLHttpRequest();
  } else {
    request = new XHR2();
    request.nodejsSet({
      httpsAgent: this.httpsAgent,
      httpAgent: this.httpAgent
    });
  }

  request.open('POST', this.host, true);
  request.setRequestHeader('Content-Type', 'application/json');
  request.timeout = this.timeout;
  request.withCredentials = this.withCredentials;

  if (this.headers) {
    this.headers.forEach(function (header) {
      request.setRequestHeader(header.name, header.value);
    });
  }

  return request;
};

/**
 * Should be used to make async request
 *
 * @method send
 * @param {Object} payload
 * @param {Function} callback triggered on end with (err, result)
 */
HttpProvider.prototype.send = function (payload, callback) {
  let _this = this;
  let request = this._prepareRequest();

  request.onreadystatechange = function () {
    if (request.readyState === 4 && request.timeout !== 1) {
      let result = request.responseText;
      let error = null;

      try {
        result = JSON.parse(result);
      } catch (e) {
        error = errors.InvalidResponse(request.responseText);
      }

      _this.connected = true;
      callback(error, result);
    }
  };

  request.ontimeout = function () {
    _this.connected = false;
    callback(errors.ConnectionTimeout(this.timeout));
  };

  try {
    request.send(JSON.stringify(payload));
  } catch (error) {
    this.connected = false;
    callback(errors.InvalidConnection(this.host));
  }
};

HttpProvider.prototype.disconnect = function () {
  //NO OP
};

/**
 * Returns the desired boolean.
 *
 * @method supportsSubscriptions
 * @returns {boolean}
 */
HttpProvider.prototype.supportsSubscriptions = function () {
  return false;
};

module.exports = HttpProvider;
