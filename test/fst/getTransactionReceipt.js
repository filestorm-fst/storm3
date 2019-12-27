const config = require('../config');

const {Storm3} = require('../export');

(async function () {
  let ins = new Storm3(config.host);
  await ins.fst.isSyncing();
  console.log(await ins.fst.getTransactionReceipt('0xd347a2fdfff2f3cc1769b42e8f4fbe8b3fa08f1cb875bd78d3ea7b5aedf618a8'));
}());



