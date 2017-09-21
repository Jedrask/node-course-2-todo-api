const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {

    if (err) {
        return console.log('Błąd ', err);
    }

    // db.collection('Todos').insertOne({
    //     text: 'Something to do',
    //     completed: false
    // }, (err, result) => {
    //     if (err) {
    //         return console.log('Bad insert ', err);
    //     }

    //     console.log(JSON.stringify(result.ops), undefined, 2);
    // });

    db.collection('Users').insertOne({
        name: 'Jedras',
        age: 49,
        location: 'Koszalin'
    }, (err, result) => {
        if (err) {
            return console.log('Not inserted ', err);
        }

        console.log(JSON.stringify(result.ops, undefined, 2));
    });

    db.close();
});