const config = require('../../config');

const {Storm3} = require('../../export');

(async function () {
  let ins = new Storm3(config.host);
  await ins.fst.isSyncing();
  console.log(ins.fst.Iban.toAddress("XE7338O073KYGTWWZN0F2WZ0R8PX5ZPPZS"));
}());




