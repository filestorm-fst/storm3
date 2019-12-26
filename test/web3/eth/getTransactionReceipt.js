const config = require('../../config');

const {Web3} = require('../../export');

(async function () {
  let ins = new Web3(config.host);
  await ins.eth.isSyncing();
  console.log(await ins.eth.getTransactionReceipt('0xd347a2fdfff2f3cc1769b42e8f4fbe8b3fa08f1cb875bd78d3ea7b5aedf618a8'));
}());



