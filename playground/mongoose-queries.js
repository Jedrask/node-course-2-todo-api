const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

var id = '59c8b80176cbeb0d59cdd043';

User.find().then( (users) => {
    console.log({users});
});

User.find({_id: id}).then( (user) => {
    console.log('Szukaj po id ', user);
});

User.findById(id).then((user) => {
    if (!user) {
        return console.log('Not found id: ', id);
    }

    console.log('Founf user by id: ', user);
})
