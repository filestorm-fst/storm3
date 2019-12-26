const config = require('../../config');

const {Web3} = require('../../export');

(async function () {
  let ins = new Web3(config.host);
  await ins.eth.isSyncing();
  console.log(await ins.eth.getBalance('0x2EE4Ec3db25cb561c9AdFAD7b8682bE803e2fB40'));
}());



