const version = require('../package.json').version;
const core = require('../../fst3-core/export');
const Eth = require('../../fst3-eth/export');
const Net = require('../../fst3-net/export');
const Personal = require('../../fst3-eth-personal/export');
const Shh = require('../../fst3-shh/export');
const Bzz = require('../../fst3-bzz/export');
const utils = require('../../fst3-utils/export');

function Fst3() {
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

Fst3.version = version;
Fst3.utils = utils;
Fst3.modules = {
  Eth,
  Net,
  Personal,
  Shh,
  Bzz
};

core.addProviders(Fst3);

module.exports = Fst3;

