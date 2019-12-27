const version = require('../package.json').version;
const core = require('../../storm3-core/export');
const Fst = require('../../storm3-fst/export');
const Net = require('../../storm3-net/export');
const Personal = require('../../storm3-fst-personal/export');
const Shh = require('../../storm3-shh/export');
const Bzz = require('../../storm3-bzz/export');
const utils = require('../../storm3-utils/export');

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
  this.modules = {
    Fst,
    Net,
    Personal,
    Shh,
    Bzz
  };
}

Storm3.version = version;
Storm3.utils = utils;
Storm3.modules = {
  Fst,
  Net,
  Personal,
  Shh,
  Bzz
};

core.addProviders(Storm3);

module.exports = Storm3;

