const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');

var todos = [{
    text: 'First element in test'
}, {
    text: 'Second element in test'
}];

beforeEach( (done) => {
    Todo.remove({}).then( () => {
        Todo.insertMany(todos);
    }).then(() => done())
});

describe('POST /todos', () => {

    it('it should create a todo', (done) => {
        var text = 'tekst do dodania';

        request(app)
            .post('/todos') //Tutaj wykonujemy post z pliku server.js
            .send({text}) //Tutaj wysyłamy w res 'text'
            .expect(200)
            .expect( (res) => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                Todo.find().then( (result) => {
                    expect(result.length).toBe(3);
                    expect(result[2].text).toBe(text);
                    done();
                }).catch((e) => done(e));

            })
    });

    it('It should NOT create a todo', (done) => {

        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .expect((res) => {
                expect(res.body.errors.text.message).toBe('Path `text` is required.')
            }).end((err, res) => {
                if (err)
                    return done(err);
                Todo.find().then((todos) => {
                    expect(todos.length).toBe(2);
                    done();
                }).catch((e) => {
                    done(e);
                })
            });
    })

});

describe('GET /todos', () => {

    it('Should be OK', (done) => {
        request(app)
            .get('/todos')
            .send(todos)
            .expect(200)
            .expect((res) => {
                expect(typeof res.body).toBe('object')
            }).end((err, res) => {
                if (err)
                    return done(err);
                done();
            })
    })
});