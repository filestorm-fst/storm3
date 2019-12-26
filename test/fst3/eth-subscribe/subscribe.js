const config = require('../../config');

const {Fst3} = require('../../export');

(async function () {
  let ins = new Fst3(config.host);
  await ins.eth.isSyncing();
  let subscription = ins.eth.subscribe('logs', {}, function (error, result) {
    console.log(result);
  });

  subscription.on('data', function (log) {
    console.log(log);
  });
  subscription.on('changed', function (log) {
  });

}());



