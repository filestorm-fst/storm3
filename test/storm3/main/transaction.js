const Storm3 = require('../../../project/storm3/export');
let storm3 = new Storm3('http://');
const Tx = require('ethereumjs-tx');
(async function f() {

  let nonce = await storm3.fst.getTransactionCount('0x568b0551522a493f7268e11ab0197aeb99584af5');


  let privateKey = Buffer.from('76b67446f49bc1a7c10de41dd7530d28126bd8606614c80ecb4e3b81782eb9cc', 'hex');
  let rawTx = {
    nonce: nonce,
    gasPrice: storm3.utils.toHex(0),
    gasLimit: storm3.utils.toHex(4300000),
    gas: storm3.utils.toHex(41000),
    to: '0x568b0551522a493f7268e11ab0197aeb99584af5',
    value: 0,
    data: storm3.utils.toHex('qq')
  };
  let tx = new Tx(rawTx);
  tx.sign(privateKey);
  let serializedTx = tx.serialize();
  let hash = await storm3.fst.sendSignedTransaction('0x' + serializedTx.toString('hex'));
  console.error(hash);
  // set nonce to local storage
}());
