const core = require('../../storm3-core/export');
const Method = require('../../storm3-core-method/export');
const utils = require('../../storm3-utils/export');


const Net = function () {
  let _this = this;

  // sets _requestmanager
  core.packageInit(this, arguments);
  [
    new Method({
      name: 'getId',
      call: 'net_version',
      params: 0,
      outputFormatter: parseInt
    }),
    new Method({
      name: 'isListening',
      call: 'net_listening',
      params: 0
    }),
    new Method({
      name: 'getPeerCount',
      call: 'net_peerCount',
      params: 0,
      outputFormatter: utils.hexToNumber
    })
  ].forEach(function (method) {
    method.attachToObject(_this);
    method.setRequestManager(_this._requestManager);
  });

};

core.addProviders(Net);


module.exports = Net;


