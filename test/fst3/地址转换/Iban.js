const config = require('../../config');

const {storm3} = require('../../export');

(async function () {
  let ins = new storm3(config.host);
  await ins.eth.isSyncing();
  console.log(new ins.eth.Iban('XE81ETHXREGGAVOFYORK'));
}());




