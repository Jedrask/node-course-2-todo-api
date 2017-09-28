//const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');


var dane = { tekst: "tralala", number: 1002};

var token = jwt.sign(dane, '123abc!');
console.log(token);

var decode = JSON.stringify(jwt.decode(token, '123abc!'));
console.log(`Decoded ${decode}`);