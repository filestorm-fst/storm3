const config = require('../../config');

const {Storm3} = require('../../export');

(async function () {
  let ins = new Storm3(config.host);
  await ins.fst.isSyncing();
  let subscription = ins.fst.subscribe('logs', {}, function (error, result) {
    console.log(result);
  });

  subscription.on('data', function (log) {
    console.log(log);
  });
  subscription.on('changed', function (log) {
  });

}());



