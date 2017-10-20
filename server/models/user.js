var mongoose = require('mongoose');
var validator = require('validator');
var jwt = require('jsonwebtoken');
var _ = require('lodash');
var bcrypt = require('bcryptjs');

var userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        unique: true,
        validate: {
            validator: (v) => {
                return validator.isEmail(v);
            },
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        require: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            require: true
        },
        token: {
            type: String,
            require: true
        }
    }]
});

//Metoda instancyjna wywoływana przy kazdym SAVE(), sprawdza czy zmieniło się hasło
//jeśli tak na nowo je hashuje za pomocą bcrypt
userSchema.pre('save', function(next) {
    var user = this;

    if(user.isModified('password')) {
        bcrypt.genSalt(10).then((salt) => {
            return bcrypt.hash(user.password, salt);
        }).then((hash) => {
            user.password = hash;
            next();
        });
    } else {
        console.log('not modified')
        next();
    }
});

//metoda statyczna słuząca do zweryfikowania poprawności TOKENA autentykacyjnego
//i znalezienia dla niego USERa. Wykorzystuje do tego JSONWEBTOKEN
userSchema.statics.findByToken = function (token) {

    var User = this;

    try {
        var decode = jwt.verify(token, '123abc');
    } catch(e) {
        return Promise.reject();
    }

    return User.findOne({
        '_id': decode.id,
        'tokens.access': 'auth',
        'tokens.token': token
    });

};

userSchema.statics.findByCredentials = function (email, password) {
    var User = this;
    
    return User.findOne({email}).then((user) => {
        if (!user) {
            return Promise.reject('brak usera');
        };
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, res) => {
                if (res) {
                    resolve(user);
                } else {
                    reject('bad password');
                }
            });
        });

    })
};

// jest to nadpisanie funkcji oryginalnej w celu ograniczenia informacji zwracanej do usera
//za pomocą res.send(user). aby nie zwracać wszystkich informacji z bazy ale tylko te, które trzeba
//czyli np. bez tokenu autoryzacyjnego
userSchema.methods.toJSON = function () {

    var user = this;
    var newUser = user.toObject();
    return _.pick(newUser, ['_id', 'email']);
    
};

//metoda generująca TOKENA do autentykacji przy zakładaniu USERa
//do budowy TOKENA wykorzystujemy obiekt z _id oraz rodzajem access'u
//_id przydaje nam się do wyszukania USERa po tem w bazie
userSchema.methods.generateAuthToken = function () {

    var user = this;
    var access = 'auth';
    var token = jwt.sign({id: user._id.toHexString(), access}, '123abc').toString();
//po wygenerowaniu tokena dodajemy go to tablicy TOKENS i następnie zapisujemy do bazy
    user.tokens.push({access, token});

    return user.save().then(() => {
        return token;
    }).catch((e) => {
        console.log('błąd');
    });
};

var User = mongoose.model('User', userSchema);

module.exports = {User};