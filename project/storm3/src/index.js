const version = require('../package.json').version;
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

module.exports = Storm3;

