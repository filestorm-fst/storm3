const config = require('../../config');

const {Fst3} = require('../../export');

(async function () {
  let ins = new Fst3(config.host);
  await ins.eth.isSyncing();
  console.log(await ins.eth.getTransactionFromBlock(88, 0));
}());


