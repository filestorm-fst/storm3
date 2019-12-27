const config = require('../../config');

const {Storm3} = require('../../export');

(async function () {
  let ins = new Storm3(config.host);
  await ins.fst.isSyncing();
  console.log(await ins.fst.getBalance('0x2EE4Ec3db25cb561c9AdFAD7b8682bE803e2fB40'));
}());



