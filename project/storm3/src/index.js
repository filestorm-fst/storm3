const version = require('../package.json').version;


// const core = require('../../storm3-core/export');
// const Fst = require('../../storm3-fst/export');
// const Net = require('../../storm3-net/export');
// const Personal = require('../../storm3-fst-personal/export');
// const Shh = require('../../storm3-shh/export');
// const Bzz = require('../../storm3-bzz/export');
// const utils = require('../../storm3-utils/export');
//
const core = require('storm3-core');
const Fst = require('storm3-fst');
const Net = require('storm3-net');
const Personal = require('storm3-fst-personal');
const Shh = require('storm3-shh');
const Bzz = require('storm3-bzz');
const utils = require('storm3-utils');
let modules = {
  Fst,
  Net,
  Personal,
  Shh,
  Bzz
};

function Storm3() {
  const _this = this;


  core.packageInit(this, arguments);

  this.version = version;
  this.utils = utils;

  this.fst = new Fst(this);
  this.shh = new Shh(this);
  this.bzz = new Bzz(this);

  // overwrite package setProvider
  const setProvider = this.setProvider;
  this.setProvider = function (provider, net) {
    setProvider.apply(_this, arguments);

    this.fst.setProvider(provider, net);
    this.shh.setProvider(provider, net);
    this.bzz.setProvider(provider);

    return true;
  };
  // modules
  this.modules = modules;
}

Storm3.version = version;
Storm3.utils = utils;
Storm3.modules = modules;

core.addProviders(Storm3);


Storm3.encodeAddress = function (address) {
  if (/^0x/.test(address)) {
    address = address.slice(2, address.length);
  }
  return 't6xgsbls' + Storm3.utils.sha3(address).slice(2, 10) + address
};

Storm3.decodeAddress = function (address) {
  return '0x' + address.slice(16, address.length);
};

module.exports = Storm3;

