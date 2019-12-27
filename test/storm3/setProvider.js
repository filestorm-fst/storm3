const config = require('../config');

const {Storm3} = require('../export');

(async function () {
  let fst3 = new Storm3(config.host);
  console.log(await fst3.fst.getGasPrice());
}());

(async function () {

  let fst3 = new Storm3(new Storm3.providers.HttpProvider(config.host));

  fst3.setProvider(config.host);
  fst3.setProvider(new Storm3.providers.HttpProvider(config.host));
  console.log(await fst3.fst.getGasPrice());
}());
