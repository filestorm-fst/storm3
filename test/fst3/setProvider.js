const config = require('../config');

const {storm3} = require('../export');

(async function () {
  let fst3 = new storm3(config.host);
  console.log(await fst3.eth.getGasPrice());
}());

(async function () {

  let fst3 = new storm3(new storm3.providers.HttpProvider(config.host));

  fst3.setProvider(config.host);
  fst3.setProvider(new storm3.providers.HttpProvider(config.host));
  console.log(await fst3.eth.getGasPrice());
}());
