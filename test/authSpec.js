process.env.NODE_ENV = 'test'

const app = require("../app");
const request = require("supertest");
const expect = require("chai").expect;
const passportStub = require("passport-stub");
const knex = require("../db/knex");

passportStub.install(app);

const autenticateUser =(done) =>{
  knex('users').where('id',1).then(user => {
    passportStub.login(user[0]);
    done();
  })
}

beforeEach(done => {
  knex.migrate.latest().then(() => {
    knex.seed.run().then(() =>{
      done()
    })
  })
})

afterEach(done => {
  knex.migrate.rollback().then(() => {
    done();
  })
})

describe("if authenticated", () =>{
  beforeEach(function(done) {
      autenticateUser(done);
    });
  afterEach(function(done) {
    passportStub.logout();
    done();
  });
  it("displays the users page when logged in", (done) =>{
     request(app)
    .get('/users')
    .end((err,res) => {
      expect(res.status).to.equal(200)
      done();
    })
  });
});

describe("if authorized", () =>{
  beforeEach(function(done) {
      autenticateUser(done);
    });
  afterEach(function(done) {
    passportStub.logout();
    done();
  });
  it("displays the users edit page when logged in", (done) =>{
     request(app)
    .get('/users/1/edit')
    .end((err,res) => {
      expect(res.status).to.equal(200)
      done();
    })
  });
});


describe("if not authenticated", () =>{
  it("displays the users page when logged in", (done) =>{
     request(app)
    .get('/users')
    .end((err,res) => {
      expect(res.status).to.equal(302)
      expect(res.text.toLowerCase()).to.equal('found. redirecting to /login')
      done();
    })
  });
});

describe("if not authorized", () =>{
  beforeEach(function(done) {
      autenticateUser(done);
    });
  afterEach(function(done) {
    passportStub.logout();
    done();
  });
  it("displays the users page when logged in", (done) =>{
     request(app)
    .get('/users/3/edit')
    .end((err,res) => {
      expect(res.status).to.equal(302)
      expect(res.text.toLowerCase()).to.equal('found. redirecting to /users')
      done();
    })
  });
});