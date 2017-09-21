const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {

    if (err) {
        return console.log('Błąd ', err);
    }
    console.log('Connected');

    // db.collection('Todos').find({ _id: new ObjectID('59c131142ea8d73091a77e73') }).toArray().then( (docs) => {
    //     console.log('Todos:');
    //     console.log(JSON.stringify(docs, undefined, 2));
    // }, (err) => {
    //     console.log('Unable to find');
    // });

    // db.collection('Todos').find().count().then( (docs) => {
    //     console.log('Count :');
    //     console.log(docs);
    // }, (err) => {
    //     console.log('Unable to find');
    // });

    db.collection('Todos').find().count(
        (err,count) => {
            if (err)
                return console.log(err);

            console.log('Licznik :', count);
        });

    // db.close();
});
