const config = require('../config');

const {storm3} = require('../export');

(async function () {
  console.log(storm3.modules);
  console.log(new storm3().modules);
}());


