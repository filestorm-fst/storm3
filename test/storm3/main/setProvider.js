const config = require('../../config');

const {Storm3} = require('../../export');

(async function () {
  let ins = new Storm3(config.host);
  console.log(await ins.fst.getGasPrice());
}());

(async function () {

  let ins = new Storm3(new Storm3.providers.HttpProvider(config.host));

  ins.setProvider(config.host);
  ins.setProvider(new Storm3.providers.HttpProvider(config.host));
  console.log(await ins.fst.getGasPrice());
}());
