const config = require('../../config');

const {Storm3} = require('../../export');

(async function () {
  console.log(Storm3.modules);
  console.log(new Storm3().modules);
}());


