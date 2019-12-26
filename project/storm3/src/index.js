const version = require('../package.json').version;
const core = require('../../storm3-core/export');
const Eth = require('../../storm3-eth/export');
const Net = require('../../storm3-net/export');
const Personal = require('../../storm3-eth-personal/export');
const Shh = require('../../storm3-shh/export');
const Bzz = require('../../storm3-bzz/export');
const utils = require('../../storm3-utils/export');

function storm3() {
  const _this = this;


  core.packageInit(this, arguments);

  this.version = version;
  this.utils = utils;

  this.eth = new Eth(this);
  this.shh = new Shh(this);
  this.bzz = new Bzz(this);

  // overwrite package setProvider
  const setProvider = this.setProvider;
  this.setProvider = function (provider, net) {
    setProvider.apply(_this, arguments);

    this.eth.setProvider(provider, net);
    this.shh.setProvider(provider, net);
    this.bzz.setProvider(provider);

    return true;
  };
  // modules
  this.modules = {
    Eth,
    Net,
    Personal,
    Shh,
    Bzz
  };
}

storm3.version = version;
storm3.utils = utils;
storm3.modules = {
  Eth,
  Net,
  Personal,
  Shh,
  Bzz
};

core.addProviders(storm3);

module.exports = storm3;

