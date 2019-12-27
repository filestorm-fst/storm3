const PromiEvent = require('storm3-core-promievent');
const namehash = require('eth-ens-namehash');
const _ = require('underscore');

/**
 * @param {Registry} registry
 * @constructor
 */
function ResolverMethodHandler(registry) {
  this.registry = registry;
}

/**
 * Executes an resolver method and returns an eventifiedPromise
 *
 * @param {string} ensName
 * @param {string} methodName
 * @param {array} methodArguments
 * @param {function} callback
 * @returns {Object}
 */
ResolverMethodHandler.prototype.method = function (ensName, methodName, methodArguments, callback) {
  return {
    call: this.call.bind({
      ensName: ensName,
      methodName: methodName,
      methodArguments: methodArguments,
      callback: callback,
      parent: this
    }),
    send: this.send.bind({
      ensName: ensName,
      methodName: methodName,
      methodArguments: methodArguments,
      callback: callback,
      parent: this
    })
  };
};

/**
 * Executes call
 *
 * @returns {eventifiedPromise}
 */
ResolverMethodHandler.prototype.call = function (callback) {
  let self = this;
  let promiEvent = new PromiEvent();
  let preparedArguments = this.parent.prepareArguments(this.ensName, this.methodArguments);

  this.parent.registry.resolver(this.ensName).then(function (resolver) {
    self.parent.handleCall(promiEvent, resolver.methods[self.methodName], preparedArguments, callback);
  }).catch(function (error) {
    promiEvent.reject(error);
  });

  return promiEvent.eventEmitter;
};


/**
 * Executes send
 *
 * @param {Object} sendOptions
 * @param {function} callback
 * @returns {eventifiedPromise}
 */
ResolverMethodHandler.prototype.send = function (sendOptions, callback) {
  let self = this;
  let promiEvent = new PromiEvent();
  let preparedArguments = this.parent.prepareArguments(this.ensName, this.methodArguments);

  this.parent.registry.resolver(this.ensName).then(function (resolver) {
    self.parent.handleSend(promiEvent, resolver.methods[self.methodName], preparedArguments, sendOptions, callback);
  }).catch(function (error) {
    promiEvent.reject(error);
  });

  return promiEvent.eventEmitter;
};

/**
 * Handles a call method
 *
 * @param {eventifiedPromise} promiEvent
 * @param {function} method
 * @param {array} preparedArguments
 * @param {function} callback
 * @returns {eventifiedPromise}
 */
ResolverMethodHandler.prototype.handleCall = function (promiEvent, method, preparedArguments, callback) {
  method.apply(this, preparedArguments).call()
    .then(function (receipt) {
      promiEvent.resolve(receipt);

      if (_.isFunction(callback)) {
        callback(receipt);
      }
    }).catch(function (error) {
    promiEvent.reject(error);

    if (_.isFunction(callback)) {
      callback(error);
    }
  });

  return promiEvent;
};

/**
 * Handles a send method
 *
 * @param {eventifiedPromise} promiEvent
 * @param {function} method
 * @param {array} preparedArguments
 * @param {Object} sendOptions
 * @param {function} callback
 * @returns {eventifiedPromise}
 */
ResolverMethodHandler.prototype.handleSend = function (promiEvent, method, preparedArguments, sendOptions, callback) {
  method.apply(this, preparedArguments).send(sendOptions)
    .on('transactionHash', function (hash) {
      promiEvent.eventEmitter.emit('transactionHash', hash);
    })
    .on('confirmation', function (confirmationNumber, receipt) {
      promiEvent.eventEmitter.emit('confirmation', confirmationNumber, receipt);
    })
    .on('receipt', function (receipt) {
      promiEvent.eventEmitter.emit('receipt', receipt);
      promiEvent.resolve(receipt);

      if (_.isFunction(callback)) {
        callback(receipt);
      }
    })
    .on('error', function (error) {
      promiEvent.eventEmitter.emit('error', error);
      promiEvent.reject(error);

      if (_.isFunction(callback)) {
        callback(error);
      }
    });

  return promiEvent;
};

/**
 * Adds the ENS node to the arguments
 *
 * @param {string} name
 * @param {array} methodArguments
 * @returns {array}
 */
ResolverMethodHandler.prototype.prepareArguments = function (name, methodArguments) {
  let node = namehash.hash(name);

  if (methodArguments.length > 0) {
    methodArguments.unshift(node);

    return methodArguments;
  }

  return [node];
};

module.exports = ResolverMethodHandler;
