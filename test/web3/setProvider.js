const config = require('../config');

const {Web3} = require('../export');

(async function () {
  let web3 = new Web3(config.host);
  console.log(await web3.eth.getGasPrice());
}());

(async function () {

  let web3 = new Web3(new Web3.providers.HttpProvider(config.host));

  web3.setProvider(config.host);
  web3.setProvider(new Web3.providers.HttpProvider(config.host));
  console.log(await web3.eth.getGasPrice());
}());
