const config = require('../../config');

const {storm3} = require('../../export');

(async function () {
  let ins = new storm3(config.host);
  await ins.eth.isSyncing();
  console.log(await ins.eth.getTransaction('0xd347a2fdfff2f3cc1769b42e8f4fbe8b3fa08f1cb875bd78d3ea7b5aedf618a8'));
}());



