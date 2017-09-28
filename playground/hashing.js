//const {SHA256} = require('crypto-js');
//const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password = '123abc';
var hashedPassword = '$2a$10$AelSYjLqWwtHIOerX4rDE.d.zhaJKCpyqzNJDcO4nZP/HAsmQG5Ua';

bcrypt.genSalt(10).then((salt) => {
    console.log('sol ', salt);
    return bcrypt.hash(password, salt);
}).then((hash) => {
    console.log(hash);
});

bcrypt.compare(password, hashedPassword, (err, res) => {
    console.log(res);
})