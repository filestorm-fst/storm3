const EventEmitter = require('eventemitter3');
const Promise = require('any-promise');

/**
 * This function generates a defer promise and adds eventEmitter functionality to it
 *
 * @method eventifiedPromise
 */
const PromiEvent = function PromiEvent(justPromise) {
  let resolve, reject,
    eventEmitter = new Promise(function () {
      resolve = arguments[0];
      reject = arguments[1];
    });

  if (justPromise) {
    return {
      resolve: resolve,
      reject: reject,
      eventEmitter: eventEmitter
    };
  }

  // get eventEmitter
  let emitter = new EventEmitter();

  // add eventEmitter to the promise
  eventEmitter._events = emitter._events;
  eventEmitter.emit = emitter.emit;
  eventEmitter.on = emitter.on;
  eventEmitter.once = emitter.once;
  eventEmitter.off = emitter.off;
  eventEmitter.listeners = emitter.listeners;
  eventEmitter.addListener = emitter.addListener;
  eventEmitter.removeListener = emitter.removeListener;
  eventEmitter.removeAllListeners = emitter.removeAllListeners;

  return {
    resolve: resolve,
    reject: reject,
    eventEmitter: eventEmitter
  };
};

PromiEvent.resolve = function (value) {
  let promise = PromiEvent(true);
  promise.resolve(value);
  return promise.eventEmitter;
};

module.exports = PromiEvent;
