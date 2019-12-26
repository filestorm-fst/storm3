const config = require('../../config');

const {Storm3} = require('../../export');

(async function () {
  let ins = new Storm3(config.host);
  await ins.eth.isSyncing();
  console.log(await ins.eth.getTransactionCount('0xd02443b8d564fed4ad332cd52508b69b511df5b8'));
}());




