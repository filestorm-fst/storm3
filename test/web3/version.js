const config = require('../config');

const {Web3} = require('../export');

(async function () {
  console.log(Web3.version);
  console.log(new Web3().version);
}());



