const {Storm3} = require('../../export');




console.log(Storm3.encodeAddress('0x53e5c08cb895599e7cfa5da58a783a56e9f140db'));
console.log(Storm3.encodeAddress('0x53e5c08cb895599e7cfa5da58a783a56e9f140db').length);

console.log(Storm3.decodeAddress(Storm3.encodeAddress('0x53e5c08cb895599e7cfa5da58a783a56e9f140db')));



