const _ = require('underscore');
const errors = require('storm3-core-helpers').errors;
const Jsonrpc = require('./jsonrpc.js');
const BatchManager = require('./batch.js');
const givenProvider = require('./givenProvider.js');
const WebsocketProvider = require('storm3-providers-ws');
const HttpProvider = require('storm3-providers-http');
const IpcProvider = require('storm3-providers-ipc');
/**
 * It's responsible for passing messages to providers
 * It's also responsible for polling the ethereum node for incoming messages
 * Default poll timeout is 1 second
 * Singleton
 */
const RequestManager = function RequestManager(provider) {
  this.provider = null;
  this.providers = RequestManager.providers;

  this.setProvider(provider);
  this.subscriptions = {};
};


RequestManager.givenProvider = givenProvider;

RequestManager.providers = {
  WebsocketProvider,
  HttpProvider,
  IpcProvider
};


/**
 * Should be used to set provider of request manager
 *
 * @method setProvider
 * @param {Object} p
 * @param {Object} net
 */
RequestManager.prototype.setProvider = function (p, net) {
  let _this = this;

  // autodetect provider
  if (p && typeof p === 'string' && this.providers) {

    // HTTP
    if (/^http(s)?:\/\//i.test(p)) {
      p = new this.providers.HttpProvider(p);

      // WS
    } else if (/^ws(s)?:\/\//i.test(p)) {
      p = new this.providers.WebsocketProvider(p);

      // IPC
    } else if (p && typeof net === 'object' && typeof net.connect === 'function') {
      p = new this.providers.IpcProvider(p, net);

    } else if (p) {
      throw new Error('Can\'t autodetect provider for "' + p + '"');
    }
  }

  // reset the old one before changing, if still connected
  if (this.provider && this.provider.connected)
    this.clearSubscriptions();


  this.provider = p || null;

  // listen to incoming notifications
  if (this.provider && this.provider.on) {
    this.provider.on('data', function requestManagerNotification(result, deprecatedResult) {
      result = result || deprecatedResult; // this is for possible old providers, which may had the error first handler

      // check for result.method, to prevent old providers errors to pass as result
      if (result.method && _this.subscriptions[result.params.subscription] && _this.subscriptions[result.params.subscription].callback) {
        _this.subscriptions[result.params.subscription].callback(null, result.params.result);
      }
    });
    // TODO add error, end, timeout, connect??
    // this.provider.on('error', function requestManagerNotification(result){
    //     Object.keys(_this.subscriptions).forEach(function(id){
    //         if(_this.subscriptions[id].callback)
    //             _this.subscriptions[id].callback(err);
    //     });
    // }
  }
};


/**
 * Should be used to asynchronously send request
 *
 * @method sendAsync
 * @param {Object} data
 * @param {Function} callback
 */
RequestManager.prototype.send = function (data, callback) {
  callback = callback || function () {
  };

  if (!this.provider) {
    return callback(errors.InvalidProvider());
  }

  let payload = Jsonrpc.toPayload(data.method, data.params);
  this.provider[this.provider.sendAsync ? 'sendAsync' : 'send'](payload, function (err, result) {
    if (result && result.id && payload.id !== result.id) return callback(new Error('Wrong response id "' + result.id + '" (expected: "' + payload.id + '") in ' + JSON.stringify(payload)));

    if (err) {
      return callback(err);
    }

    if (result && result.error) {
      return callback(errors.ErrorResponse(result));
    }

    if (!Jsonrpc.isValidResponse(result)) {
      return callback(errors.InvalidResponse(result));
    }

    callback(null, result.result);
  });
};

/**
 * Should be called to asynchronously send batch request
 *
 * @method sendBatch
 * @param {Array}  data batch
 * @param {Function} callback
 */
RequestManager.prototype.sendBatch = function (data, callback) {
  if (!this.provider) {
    return callback(errors.InvalidProvider());
  }

  let payload = Jsonrpc.toBatchPayload(data);
  this.provider[this.provider.sendAsync ? 'sendAsync' : 'send'](payload, function (err, results) {
    if (err) {
      return callback(err);
    }

    if (!_.isArray(results)) {
      return callback(errors.InvalidResponse(results));
    }

    callback(null, results);
  });
};


/**
 * Waits for notifications
 *
 * @method addSubscription
 * @param {String} id           the subscription id
 * @param {String} name         the subscription name
 * @param {String} type         the subscription namespace (eth, personal, etc)
 * @param {Function} callback   the callback to call for incoming notifications
 */
RequestManager.prototype.addSubscription = function (id, name, type, callback) {
  if (this.provider.on) {
    this.subscriptions[id] = {
      callback: callback,
      type: type,
      name: name
    };

  } else {
    throw new Error('The provider doesn\'t support subscriptions: ' + this.provider.constructor.name);
  }
};

/**
 * Waits for notifications
 *
 * @method removeSubscription
 * @param {String} id           the subscription id
 * @param {Function} callback   fired once the subscription is removed
 */
RequestManager.prototype.removeSubscription = function (id, callback) {
  const _this = this;

  if (this.subscriptions[id]) {

    this.send({
      method: this.subscriptions[id].type + '_unsubscribe',
      params: [id]
    }, callback);

    // remove subscription
    delete _this.subscriptions[id];
  }
};

/**
 * Should be called to reset the subscriptions
 *
 * @method reset
 */
RequestManager.prototype.clearSubscriptions = function (keepIsSyncing) {
  let _this = this;


  // uninstall all subscriptions
  Object.keys(this.subscriptions).forEach(function (id) {
    if (!keepIsSyncing || _this.subscriptions[id].name !== 'syncing')
      _this.removeSubscription(id);
  });


  //  reset notification callbacks etc.
  if (this.provider.reset)
    this.provider.reset();
};

module.exports = {
  Manager: RequestManager,
  BatchManager
};
