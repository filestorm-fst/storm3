const config = require('../../config');

const {Fst3} = require('../../export');

(async function () {
  let ins = new Fst3(config.host);
  await ins.eth.isSyncing();
  console.log(ins.eth.Iban.toAddress("XE7338O073KYGTWWZN0F2WZ0R8PX5ZPPZS"));
}());




