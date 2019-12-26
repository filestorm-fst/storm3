const config = require('../config');

const {Fst3} = require('../export');

(async function () {
  console.log(Fst3.version);
  console.log(new Fst3().version);
}());



