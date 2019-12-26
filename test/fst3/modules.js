const config = require('../config');

const {Fst3} = require('../export');

(async function () {
  console.log(Fst3.modules);
  console.log(new Fst3().modules);
}());


