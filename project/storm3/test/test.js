const Web3 = require('../export');


(async function f() {
  let web3 = new Web3('http://39.108.132.50:8501');
  console.log(`v: ${web3.version}`);
  console.log(await web3.eth.net.isListening());

}());
