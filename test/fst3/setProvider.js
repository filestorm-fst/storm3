const config = require('../config');

const {Fst3} = require('../export');

(async function () {
  let fst3 = new Fst3(config.host);
  console.log(await fst3.eth.getGasPrice());
}());

(async function () {

  let fst3 = new Fst3(new Fst3.providers.HttpProvider(config.host));

  fst3.setProvider(config.host);
  fst3.setProvider(new Fst3.providers.HttpProvider(config.host));
  console.log(await fst3.eth.getGasPrice());
}());
