const _ = require('underscore');


module.exports = function (callback) {
  let _this = this,
    id;

  return this.net.getId()
    .then(function (givenId) {

      id = givenId;

      return _this.getBlock(0);
    })
    .then(function (genesis) {
      let returnValue = 'private';

      if (genesis.hash === '0xd4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3' &&
        id === 1) {
        returnValue = 'main';
      }
      if (genesis.hash === '0cd786a2425d16f152c658316c423e6ce1181e15c3295826d7c9904cba9ce303' &&
        id === 2) {
        returnValue = 'morden';
      }
      if (genesis.hash === '0x41941023680923e0fe4d74a34bdac8141f2540e3ae90623718e47d66d1ca4a2d' &&
        id === 3) {
        returnValue = 'ropsten';
      }
      if (genesis.hash === '0x6341fd3daf94b748c72ced5a5b26028f2474f5f00d824504e4fa37a75767e177' &&
        id === 4) {
        returnValue = 'rinkeby';
      }
      if (genesis.hash === '0xbf7e331f7f7c1dd2e05159666b3bf8bc7a8a3a9eb1d518969eab529dd9b88c1a' &&
        id === 5) {
        returnValue = 'goerli';
      }
      if (genesis.hash === '0xa3c565fc15c7478862d50ccd6561e3c06b24cc509bf388941c25ea985ce32cb9' &&
        id === 42) {
        returnValue = 'kovan';
      }

      if (_.isFunction(callback)) {
        callback(null, returnValue);
      }

      return returnValue;
    })
    .catch(function (err) {
      if (_.isFunction(callback)) {
        callback(err);
      } else {
        throw err;
      }
    });
};
