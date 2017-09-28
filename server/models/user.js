var mongoose = require('mongoose');
var validator = require('validator');
var jwt = require('jsonwebtoken');
var _ = require('lodash');

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

userSchema.methods.toJSON = function () {
    var user = this;

    var newUser = user.toObject();

    return _.pick(newUser, ['_id', 'email']);
}

userSchema.methods.generateAuthToken = function () {

    var user = this;
    var access = 'auth';
    var token = jwt.sign({id: user._id.toHexString(), access}, '123abc').toString();

    user.tokens.push({access, token});

    return user.save().then(() => {
        return token;
    }, (e) => {
        console.log(e);
    });
};

var User = mongoose.model('User', userSchema);

module.exports = {User};