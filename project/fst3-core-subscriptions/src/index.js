const Subscription = require('./subscription.js');


const Subscriptions = function Subscriptions(options) {
  this.name = options.name;
  this.type = options.type;
  this.subscriptions = options.subscriptions || {};
  this.requestManager = null;
};


Subscriptions.prototype.setRequestManager = function (rm) {
  this.requestManager = rm;
};


Subscriptions.prototype.attachToObject = function (obj) {
  let func = this.buildCall();
  let name = this.name.split('.');
  if (name.length > 1) {
    obj[name[0]] = obj[name[0]] || {};
    obj[name[0]][name[1]] = func;
  } else {
    obj[name[0]] = func;
  }
};


Subscriptions.prototype.buildCall = function () {
  let _this = this;

  return function () {
    if (!_this.subscriptions[arguments[0]]) {
      console.warn('Subscription ' + JSON.stringify(arguments[0]) + ' doesn\'t exist. Subscribing anyway.');
    }

    let subscription = new Subscription({
      subscription: _this.subscriptions[arguments[0]],
      requestManager: _this.requestManager,
      type: _this.type
    });

    return subscription.subscribe.apply(subscription, arguments);
  };
};


module.exports = {
  subscriptions: Subscriptions,
  subscription: Subscription
};
