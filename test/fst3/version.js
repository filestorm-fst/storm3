const config = require('../config');

const {storm3} = require('../export');

(async function () {
  console.log(storm3.version);
  console.log(new storm3().version);
}());



