const expect = require('expect');
const request = require('supertest');

const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');

const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

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

describe('GET /todo/id', () => {

    it('Should return todo doc', (done) => {
        request(app)
            .get(`/todo/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
    });

    it('Should return 404 if todo not found', (done) => {
        var newId = new ObjectID();
        request(app)
            .get(`/todo/${newId.toHexString()}`)
            .expect(404)
            .end(done);
    });

    it('Should return 404 for not valid ID', (done) => {
        request(app)
            .get('/todo/123')
            .expect(404)
            .end(done);
    });
    
});

describe('DELETE /todo/id', () => {

    it('Should delete todo', (done) => {

        var id = ObjectID(todos[1]._id);

        request(app)
            .delete(`/todo/${id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(id.toHexString());
            }).end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.findByIdAndRemove(id.toHexString()).then((todo) => {
                    expect(todo).toNotExist;
                    console.log('not');
                    done();
                }).catch((e) => done(e));
            })
    });

    it('Should return 404 if todo not found', (done) => {
        var newId = new ObjectID();
        request(app)
            .delete(`/todo/${newId.toHexString()}`)
            .expect(404)
            .end(done);
    });

    it('Should return 404 for not valid ID', (done) => {
        request(app)
            .delete('/todo/123')
            .expect(404)
            .end(done);
    });
});

describe('PATCH /todo/id', () => {


    it('Should be updated', (done) => {
        request(app)
            .patch(`/todo/${todos[0]._id.toHexString()}`)
            .send({completed: true, text: "poprawiony"})
            .expect(200)
            .expect((res) => {
                expect(res.body.completed).toBe(true);
                expect(res.body.text).toBe('poprawiony');
                done();
            })
            .end((err) => {
                if(err)
                    done(err);
            })
    });
});

describe('GET /user/me', () => {
    it('Should return user if autheticated', (done) => {
        request(app)
            .get('/user/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
                console.log(res);
            })
            .end(done);
    });

    it('Should return 401 if not authenticated', (done) => {
        request(app)
            .get('/user/me')
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual({});
            })
            .end(done);  
    });
});
