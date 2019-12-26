const config = require('../../config');

const {Web3} = require('../../export');

(async function () {
  let ins = new Web3(config.host);
  await ins.eth.isSyncing();
  console.log(ins.eth.Iban.toAddress("XE7338O073KYGTWWZN0F2WZ0R8PX5ZPPZS"));
}());




