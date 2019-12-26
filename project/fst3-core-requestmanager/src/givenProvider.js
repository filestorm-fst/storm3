let givenProvider = null;

// ADD GIVEN PROVIDER
/* jshint ignore:start */
let global;
try {
  global = Function('return this')();
} catch (e) {
  global = window;
}

// EthereumProvider
if (typeof global.ethereumProvider !== 'undefined') {
  givenProvider = global.ethereumProvider;

// Legacy fst3.currentProvider
} else if (typeof global.fst3 !== 'undefined' && global.fst3.currentProvider) {

  if (global.fst3.currentProvider.sendAsync) {
    global.fst3.currentProvider.send = global.fst3.currentProvider.sendAsync;
    delete global.fst3.currentProvider.sendAsync;
  }

  // if connection is 'ipcProviderWrapper', add subscription support
  if (!global.fst3.currentProvider.on &&
    global.fst3.currentProvider.connection &&
    global.fst3.currentProvider.connection.constructor.name === 'ipcProviderWrapper') {

    global.fst3.currentProvider.on = function (type, callback) {

      if (typeof callback !== 'function')
        throw new Error('The second parameter callback must be a function.');

      switch (type) {
        case 'data':
          this.connection.on('data', function (data) {
            var result = '';

            data = data.toString();

            try {
              result = JSON.parse(data);
            } catch (e) {
              return callback(new Error('Couldn\'t parse response data' + data));
            }

            // notification
            if (!result.id && result.method.indexOf('_subscription') !== -1) {
              callback(null, result);
            }

          });
          break;

        default:
          this.connection.on(type, callback);
          break;
      }
    };
  }

  givenProvider = global.fst3.currentProvider;
}
/* jshint ignore:end */


module.exports = givenProvider;
