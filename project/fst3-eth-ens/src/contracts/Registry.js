const _ = require('underscore');
const Contract = require('../../../fst3-eth-contract/export');
const namehash = require('eth-ens-namehash');
const PromiEvent = require('../../../fst3-core-promievent/export');
const REGISTRY_ABI = require('../ressources/ABI/Registry');
const RESOLVER_ABI = require('../ressources/ABI/Resolver');


/**
 * A wrapper around the ENS registry contract.
 *
 * @method Registry
 * @param {Ens} ens
 * @constructor
 */
function Registry(ens) {
  let self = this;
  this.ens = ens;
  this.contract = ens.checkNetwork().then(function (address) {
    let contract = new Contract(REGISTRY_ABI, address);
    contract.setProvider(self.ens.eth.currentProvider);

    return contract;
  });
}

/**
 * Returns the address of the owner of an ENS name.
 *
 * @method owner
 * @param {string} name
 * @param {function} callback
 * @return {Promise<any>}
 */
Registry.prototype.owner = function (name, callback) {
  let promiEvent = new PromiEvent(true);

  this.contract.then(function (contract) {
    contract.methods.owner(namehash.hash(name)).call()
      .then(function (receipt) {
        promiEvent.resolve(receipt);

        if (_.isFunction(callback)) {
          callback(receipt);
        }
      })
      .catch(function (error) {
        promiEvent.reject(error);

        if (_.isFunction(callback)) {
          callback(error);
        }
      });
  });

  return promiEvent.eventEmitter;
};

/**
 * Returns the resolver contract associated with a name.
 *
 * @method resolver
 * @param {string} name
 * @return {Promise<Contract>}
 */
Registry.prototype.resolver = function (name) {
  let self = this;

  return this.contract.then(function (contract) {
    return contract.methods.resolver(namehash.hash(name)).call();
  }).then(function (address) {
    let contract = new Contract(RESOLVER_ABI, address);
    contract.setProvider(self.ens.eth.currentProvider);
    return contract;
  });
};

module.exports = Registry;
