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

var {autenticate} = require('./middlware/auth');

var PORT = process.env.PORT;

var app = express();

app.use(bodyParser.json());

app.post('/users', (req, res) => {

    // Tutaj wyłuskujemy z tylko informację o EMAIL i PASSWORD
    // bo tylko to zapisujemy do bazy, resztę tworzymy sami - TOKEN ale potrzebujemy _id
    //robimy tak na wszelki wypadek jeśli jakiś cwany USER chciał nam przesałać w REQ inne dane
    //zgodne z strukturą modelu
    var body = _.pick(req.body, ['email', 'password']);
    // Tworzymy nowy obiekt do zapisania do bazy w oparciu o wcześniej utworzony
    // (wyzej) obiekt BODY
    var user = new User(body);

    user.save().then((user) => {
        // Pozapisaniu informacji o EMAIL i BODY dostaliśmu od razu _id (zostało utworzone)
        // Poprzez zdefiniowaną metodę instancyjną w modelu USER generujemy token do autentykacji
        // który następnie prześlemy w HEADER RESPONS.
        // poniewaz metoda generateAuthToken zwraca promis, my dalej go zwracamy za pomocą RETURN
        return user.generateAuthToken();
    // teraz przesyłamy dalej pozyskany TOKEN
    }).then((token) => {
        res.header('x-auth', token).send(user); //dzięki nadpisaniu toJSON w modelu USER wysyłamy tylko
    }).catch((e) => {                           //email i _id spowrotem.
        res.status(400).send(e);
    });
});

app.post('/users/login', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);

    User.findByCredentials(body.email, body.password).then((user) => {
        return user.generateAuthToken().then((token) => {
            res.header('x-auth', token).send(user);
        })
    }).catch((err) => {
        console.log(err);
        res.status(400).send();
    });
});


//korzystamy tutaj z MIDDLWARE w celu sprawdzenia czy w HEADER REQUEST jest informacja o autentykacji
//czyli 'x-auth' i posiada odpowiednią wartość. MIDDLWARE szuka w kolekcji USER'a 
//Jeśli znajdzie tak to MIDDLWARE, to przypisuje do REQ znalezionego USER'a i  daje next()
//jeśli nie to sam wysyła status 401
app.get('/user/me', autenticate, (req, res) => {
    res.send(req.user);
});
 
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