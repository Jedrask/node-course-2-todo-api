const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');

beforeEach( (done) => {
    Todo.remove({}).then( () => done() );
});

describe('POST /todos', () => {

    it('it should create a todo', (done) => {
        var text = 'tekst do dodania';

        request(app)
            .post('/todos') //Tutaj wykonujemy post z pliku server.js
            .send({text: text}) //Tutaj wysyłamy w res 'text'
            .expect(200)
            .expect( (res) => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                Todo.find().then( (result) => {
                    expect(result.length).toBe(1);
                    expect(result[0].text).toBe(text);
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
                    expect(todos.length).toBe(0);
                    done();
                }).catch((e) => {
                    done(e);
                })
            });
    })

});