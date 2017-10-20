const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
 
const todos = [{
    _id: new ObjectID(),
    text: 'First element in test',
    completed: false
}, {
    _id: new ObjectID(),
    text: 'Second element in test',
    completed: true,
    completedAt: 123
}];

const users = [{
    _id: userOneId,
    email: 'sq1@gmail.com',
    password: 'userOnePass',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userOneId, access: 'auth'}, 'abc123'.toString())
    }]
}, {
    _id: userTwoId,
    email: 'sq2@gmail.com',
    password: 'userTwopass'
}];

const populateUsers = (done) => {
    User.remove({}).then(() => {
        var userOne = new User(users[0]).save();
        var userTwo = new User(users[1]).save();

        return Promise.all([userOne, userTwo])
    }).then(() => done())
    .catch((e) => {
        console.log(e);
    })
};


const populateTodos = (done) => {
    Todo.remove({}).then( () => {
        Todo.insertMany(todos);
    }).then(() => {
        done();
    });
};


module.exports = {todos, populateTodos, users, populateUsers};