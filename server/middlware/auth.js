var {mongoose} = require('./../db/mongoose');
var {User} = require('./../models/user');

//Metoda MIDDLWARE w Express
var autenticate = (req, res, next) => {

    var token = req.header('x-auth');
    //korzystamy z funkcji statycznej zdefiniowanej w modelu USER, która na podstawie TOKENa
    //szuka USERa i go zwraca
        User.findByToken(token).then((user) => {
            if(!user) {
                return Promise.reject();
            }
            req.user = user;
            req.token = token;
            next();
        }).catch((e) => {
            res.status(401).send();
        });

};

module.exports = {
    autenticate
}