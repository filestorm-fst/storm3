const {Storm3} = require('../../export');


console.log(Storm3.encodeAddress('67176f5d3e4b8e202af156d6cbe8286a3c75ae9e')
  === 't6xgsbls41072dff67176f5d3e4b8e202af156d6cbe8286a3c75ae9e');
// console.log(Storm3.encodeAddress('0x67176f5d3e4b8e202af156d6cbe8286a3c75ae9e').length);
// //
console.log(Storm3.decodeAddress(Storm3.encodeAddress('67176f5d3e4b8e202af156d6cbe8286a3c75ae9e'))
  === '0x67176f5d3e4b8e202af156d6cbe8286a3c75ae9e');



