const config = require('../../config');

const {storm3} = require('../../export');

(async function () {
  let ins = new storm3(config.host);
  await ins.eth.isSyncing();
  console.log(await ins.eth.getStorageAt('0x2EE4Ec3db25cb561c9AdFAD7b8682bE803e2fB40'));
}());



