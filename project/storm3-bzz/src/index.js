const _ = require('underscore');
const swarm = require('swarm-js');


const Bzz = function Bzz(provider) {

  this.givenProvider = Bzz.givenProvider;

  if (provider && provider._requestManager) {
    provider = provider.currentProvider;
  }

  // only allow file picker when in browser
  if (typeof document !== 'undefined') {
    this.pick = swarm.pick;
  }

  this.setProvider(provider);
};

// set default ethereum provider
/* jshint ignore:start */
Bzz.givenProvider = null;
if (typeof ethereumProvider !== 'undefined' && ethereumProvider.bzz) {
  Bzz.givenProvider = ethereumProvider.bzz;
}
/* jshint ignore:end */

Bzz.prototype.setProvider = function (provider) {
  // is ethereum provider
  if (_.isObject(provider) && _.isString(provider.bzz)) {
    provider = provider.bzz;
    // is no string, set default
  }
  // else if(!_.isString(provider)) {
  //      provider = 'http://swarm-gateways.net'; // default to gateway
  // }


  if (_.isString(provider)) {
    this.currentProvider = provider;
  } else {
    this.currentProvider = null;

    let noProviderError = new Error('No provider set, please set one using bzz.setProvider().');

    this.download = this.upload = this.isAvailable = function () {
      throw noProviderError;
    };

    return false;
  }

  // add functions
  this.download = swarm.at(provider).download;
  this.upload = swarm.at(provider).upload;
  this.isAvailable = swarm.at(provider).isAvailable;

  return true;
};


module.exports = Bzz;

