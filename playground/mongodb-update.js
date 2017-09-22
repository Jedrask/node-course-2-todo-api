const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {

    if (err) {
        return console.log('Błąd ', err);
    }
    console.log('Connected');

//    db.collection('Todos').findOneAndUpdate({
//     _id: new ObjectID('59c3e21d6733c91361a25856')
//    }, { $set: { completed: true }}, { returnOriginal: false })
//    .then( (result) => {
//     console.log(result);
//    }, (err) => {
//     consol.log(err);
//    });

    db.collection('Users').findOneAndUpdate( 
        { name: "Jedras"},
        { $set: { name: "Michał" }, $inc: { age: 1 } },
        { returnOriginal: false } )
        .then( (result) => {
            console.log(result)
        }, (err) => {
            console.log(err);
        });

    // db.close();
});
