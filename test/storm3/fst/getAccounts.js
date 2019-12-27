const config = require('../../config');

const {Storm3} = require('../../export');

(async function () {
  let ins = new Storm3(config.host);
  await ins.fst.isSyncing();
  console.log(await ins.fst.getAccounts());
}());



