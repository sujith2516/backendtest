const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
let app = require('../app');

chai.use(chaiHttp);

describe('/POST user/register', function(){
    // send unique username along with required data  
    let user = {"username": "Modi", "firstname": "Modi", "lastname": "N", "email": "Modi@email.com", "password": "abc123"};
    it('it should send a response to client stating mail has been sent', (done)=>{
        chai.request(app)
        .post('/user/register')
        .send(user)
        .end((err, res) => {
              res.should.have.status(201);
              res.body.should.be.a('object');
              res.body.should.have.property('message').eql('A verification mail has been sent to your registered mail.');
          done();
        });
    });

    // send the same obkect as that above
    it('it should send a response 409 when same data is sent over', (done)=>{
        chai.request(app)
        .post('/user/register')
        .send(user)
        .end((err, res) => {
              res.should.have.status(409);
              res.body.should.be.a('object');
              res.body.should.have.property('error').eql('User name already exists.');
          done();
        });
    });
});

describe('/POST user/login', function(){
    // send a username that does not exists in our db to get an error
    it('it should raise User does not exists error', (done)=>{
        let user = {"username": "Random user", "password": "abc1234"};
        chai.request(app)
        .post('/user/login')
        .send(user)
        .end((err, res) => {
              res.should.have.status(404);
              res.body.should.be.a('object');
              res.body.should.have.property('error').eql('User does not exists.');
          done();
        });
    });

    // send wrong password to get authentication error
    it('it should raise authentication error', (done)=>{
        let user = {"username": "Swetha", "password": "abc1234"};
          chai.request(app)
          .post('/user/login')
          .send(user)
          .end((err, res) => {
                res.should.have.status(401);
                res.body.should.be.a('object');
                res.body.should.have.property('error').eql('Authentication error');
            done();
          });
    });

    // send the user json object with valid data
    it('it should send a response token along with user info', (done)=>{
        let user = {"username": "Swetha", "password": "abc123"};
          chai.request(app)
          .post('/user/login')
          .send(user)
          .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('token');
                res.body.should.have.property('user');
                res.body.user.should.have.property('id');
                res.body.user.should.have.property('username');
                res.body.user.should.have.property('email');
                res.body.user.should.have.property('firstname');
                res.body.user.should.have.property('lastname');
            done();
          });
    });
});
