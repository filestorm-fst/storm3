const core = require('storm3-core');
const Subscriptions = require('storm3-core-subscriptions').subscriptions;
const Method = require('storm3-core-method');
// const formatters = require('web3-core-helpers').formatters;
const Net = require('storm3-net');


const Shh = function Shh() {
  let _this = this;

  // sets _requestmanager
  core.packageInit(this, arguments);

  // overwrite setProvider
  let setProvider = this.setProvider;
  this.setProvider = function () {
    setProvider.apply(_this, arguments);
    _this.net.setProvider.apply(_this, arguments);
  };

  this.net = new Net(this.currentProvider);

  [
    new Subscriptions({
      name: 'subscribe',
      type: 'shh',
      subscriptions: {
        'messages': {
          params: 1
          // inputFormatter: [formatters.inputPostFormatter],
          // outputFormatter: formatters.outputPostFormatter
        }
      }
    }),

    new Method({
      name: 'getVersion',
      call: 'shh_version',
      params: 0
    }),
    new Method({
      name: 'getInfo',
      call: 'shh_info',
      params: 0
    }),
    new Method({
      name: 'setMaxMessageSize',
      call: 'shh_setMaxMessageSize',
      params: 1
    }),
    new Method({
      name: 'setMinPoW',
      call: 'shh_setMinPoW',
      params: 1
    }),
    new Method({
      name: 'markTrustedPeer',
      call: 'shh_markTrustedPeer',
      params: 1
    }),
    new Method({
      name: 'newKeyPair',
      call: 'shh_newKeyPair',
      params: 0
    }),
    new Method({
      name: 'addPrivateKey',
      call: 'shh_addPrivateKey',
      params: 1
    }),
    new Method({
      name: 'deleteKeyPair',
      call: 'shh_deleteKeyPair',
      params: 1
    }),
    new Method({
      name: 'hasKeyPair',
      call: 'shh_hasKeyPair',
      params: 1
    }),
    new Method({
      name: 'getPublicKey',
      call: 'shh_getPublicKey',
      params: 1
    }),
    new Method({
      name: 'getPrivateKey',
      call: 'shh_getPrivateKey',
      params: 1
    }),
    new Method({
      name: 'newSymKey',
      call: 'shh_newSymKey',
      params: 0
    }),
    new Method({
      name: 'addSymKey',
      call: 'shh_addSymKey',
      params: 1
    }),
    new Method({
      name: 'generateSymKeyFromPassword',
      call: 'shh_generateSymKeyFromPassword',
      params: 1
    }),
    new Method({
      name: 'hasSymKey',
      call: 'shh_hasSymKey',
      params: 1
    }),
    new Method({
      name: 'getSymKey',
      call: 'shh_getSymKey',
      params: 1
    }),
    new Method({
      name: 'deleteSymKey',
      call: 'shh_deleteSymKey',
      params: 1
    }),

    new Method({
      name: 'newMessageFilter',
      call: 'shh_newMessageFilter',
      params: 1
    }),
    new Method({
      name: 'getFilterMessages',
      call: 'shh_getFilterMessages',
      params: 1
    }),
    new Method({
      name: 'deleteMessageFilter',
      call: 'shh_deleteMessageFilter',
      params: 1
    }),

    new Method({
      name: 'post',
      call: 'shh_post',
      params: 1,
      inputFormatter: [null]
    }),

    new Method({
      name: 'unsubscribe',
      call: 'shh_unsubscribe',
      params: 1
    })
  ].forEach(function (method) {
    method.attachToObject(_this);
    method.setRequestManager(_this._requestManager);
  });
};

Shh.prototype.clearSubscriptions = function () {
  this._requestManager.clearSubscriptions();
};

core.addProviders(Shh);


module.exports = Shh;


