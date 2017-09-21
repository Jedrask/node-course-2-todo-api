const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {

    if (err) {
        return console.log('Błąd ', err);
    }
    console.log('Connected');

    db.collection('Todos').deleteMany({text:"mizeria"}).then( (result) => {
        console.log(result);
    }, (err) => {
        console.log(err);
    } );

    db.close();
});
