var env = process.env.NODE_ENV  || 'development';
console.log('env ****** ', env);

if (env === 'development') {
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
} else if (env === 'test') {
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
}


const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
var {ObjectId} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var PORT = process.env.PORT;

var app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    var todo = new Todo({
        text: req.body.text
    });

    todo.save().then( (doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });

});

app.get('/todos', (req, res) => {

    Todo.find({}).then( (todos) => {
        res.send({todos});
    }, (e) => {
        res.status(400).send(e);
    })
});

app.get('/todo/:id', (req, res) => {
    var id = req.params.id;

    if (!ObjectId.isValid(id)) {
        return res.status(404).send();
    }

    var todo = Todo.findById(id).then((todo) => {
        if (!todo) {
            return res.status(404).send();
        }
        res.send({todo});
    }, (e) => {
        res.status(400).send(e);
    });
});

app.delete('/todo/:id', (req, res) => {
    var id = req.params.id;

    if (!ObjectId.isValid(id)) {
        return res.status(404).send();
    }

    Todo.findByIdAndRemove(id).then( (todo) => {
        if(!todo) {
            return res.status(404).send();
        }
        res.send(todo);
    }, (e) => {
        res.status(400).send();
    });

});

app.patch('/todo/:id', (req, res) => {

    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);

    if (!ObjectId.isValid(id)) {
        return res.status(404).send();
    }
        
    if(_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
       } else {
           body.completed = false;
           body.completedAt = null;
       }
    
    Todo.findByIdAndUpdate(id, body, {new: true}).then((todo) => {
        if(!todo) {
            return res.status(404).send();
        } 
        res.send(todo);

    }).catch((e) => {
        res.status(404).send(e);
    });
});


app.listen(PORT, () => {
    console.log('Started on port :', PORT);
});

module.exports = {app};