const core = require('../../fst3-core/export');
const Method = require('../../fst3-core-method/export');
const utils = require('../../fst3-utils/export');
const Net = require('../../fst3-net/export');

const formatters = require('../../fst3-core-helpers').formatters;


const Personal = function Personal() {
  let _this = this;

  // sets _requestmanager
  core.packageInit(this, arguments);

  this.net = new Net(this.currentProvider);

  let defaultAccount = null;
  let defaultBlock = 'latest';

  Object.defineProperty(this, 'defaultAccount', {
    get: function () {
      return defaultAccount;
    },
    set: function (val) {
      if (val) {
        defaultAccount = utils.toChecksumAddress(formatters.inputAddressFormatter(val));
      }

      // update defaultBlock
      methods.forEach(function (method) {
        method.defaultAccount = defaultAccount;
      });

      return val;
    },
    enumerable: true
  });
  Object.defineProperty(this, 'defaultBlock', {
    get: function () {
      return defaultBlock;
    },
    set: function (val) {
      defaultBlock = val;

      // update defaultBlock
      methods.forEach(function (method) {
        method.defaultBlock = defaultBlock;
      });

      return val;
    },
    enumerable: true
  });


  let methods = [
    new Method({
      name: 'getAccounts',
      call: 'personal_listAccounts',
      params: 0,
      outputFormatter: utils.toChecksumAddress
    }),
    new Method({
      name: 'newAccount',
      call: 'personal_newAccount',
      params: 1,
      inputFormatter: [null],
      outputFormatter: utils.toChecksumAddress
    }),
    new Method({
      name: 'unlockAccount',
      call: 'personal_unlockAccount',
      params: 3,
      inputFormatter: [formatters.inputAddressFormatter, null, null]
    }),
    new Method({
      name: 'lockAccount',
      call: 'personal_lockAccount',
      params: 1,
      inputFormatter: [formatters.inputAddressFormatter]
    }),
    new Method({
      name: 'importRawKey',
      call: 'personal_importRawKey',
      params: 2
    }),
    new Method({
      name: 'sendTransaction',
      call: 'personal_sendTransaction',
      params: 2,
      inputFormatter: [formatters.inputTransactionFormatter, null]
    }),
    new Method({
      name: 'signTransaction',
      call: 'personal_signTransaction',
      params: 2,
      inputFormatter: [formatters.inputTransactionFormatter, null]
    }),
    new Method({
      name: 'sign',
      call: 'personal_sign',
      params: 3,
      inputFormatter: [formatters.inputSignFormatter, formatters.inputAddressFormatter, null]
    }),
    new Method({
      name: 'ecRecover',
      call: 'personal_ecRecover',
      params: 2,
      inputFormatter: [formatters.inputSignFormatter, null]
    })
  ];
  methods.forEach(function (method) {
    method.attachToObject(_this);
    method.setRequestManager(_this._requestManager);
    method.defaultBlock = _this.defaultBlock;
    method.defaultAccount = _this.defaultAccount;
  });
};

core.addProviders(Personal);

module.exports = Personal;


