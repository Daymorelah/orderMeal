/* eslint-disable import/no-extraneous-dependencies */
import chai from 'chai';
import chaiHttp from 'chai-http';
import dotenv from 'dotenv';
import app from '../app';
/* eslint-enable import/no-extraneous-dependencies */

dotenv.config();

chai.use(chaiHttp);
const { expect } = chai;


describe('Integration test for the users controller', () => {
  describe('Test general error handling and welcome message', () => {
    it('should send an error when there is an unforseen error', (done) => {
      const userDetails = {
        username: 'Thomas?',
        password: 'tomnjerry',
      };
      chai.request(app).post('/api/v1/auth/login/%')
        .send(userDetails)
        .end((err, res) => {
          expect(res.status).to.deep.equal(500);
          expect(res.body.status).to.deep.equal('error');
          expect(res.body).to.have.property('message');
          done();
        });
    });
    it('should welcome the user to the API', (done) => {
      chai.request(app).get('/api/v1')
        .end((err, res) => {
          expect(res.status).to.deep.equal(200);
          expect(res.body.data).to.have.property('message');
          expect(res.body.status).to.deep.equal('success');
          done();
        });
    });
  });
  describe('Test to signUp a user', () => {
    it('should create a user and send a message that the user has ben created', (done) => {
      const userDetails = {
        username: 'Thomas',
        password: 'tomnjerry',
        email: 'tommy@wemail.com',
      };
      chai.request(app).post('/api/v1/auth/signup')
        .send(userDetails)
        .end((err, res) => {
          expect(res.status).to.deep.equal(201);
          expect(res.body.data).to.have.property('token');
          expect(res.body.status).to.deep.equal('success');
          expect(res.body.data.message).to.deep.equal('User Thomas created successfully');
          done();
        });
    });
    it('should return an error if any user detail is not present in body', (done) => {
      const userDetails = {
        username: 'Thomas',
        email: 'tommy@wemail.com',
      };
      chai.request(app).post('/api/v1/auth/signup')
        .send(userDetails)
        .end((err, res) => {
          expect(res.status).to.deep.equal(400);
          expect(res.body).to.be.an('object');
          expect(res.body).to.not.have.property('token');
          expect(res.body.status).to.deep.equal('fail');
          done();
        });
    });
    it('should return an error if email is invalid', (done) => {
      const userDetails = {
        username: 'Thomas',
        password: 'password',
        email: 'tommywemail.com',
      };
      chai.request(app).post('/api/v1/auth/signup')
        .send(userDetails)
        .end((err, res) => {
          expect(res.status).to.deep.equal(400);
          expect(res.body).to.be.an('object');
          expect(res.body).to.not.have.property('token');
          expect(res.body.status).to.deep.equal('fail');
          done();
        });
    });
    it('should return an error if username or password is invalid', (done) => {
      const userDetails = {
        username: 'Thomas&',
        password: 'password',
        email: 'tommy@wemail.com',
      };
      chai.request(app).post('/api/v1/auth/signup')
        .send(userDetails)
        .end((err, res) => {
          expect(res.status).to.deep.equal(400);
          expect(res.body).to.be.an('object');
          expect(res.body).to.not.have.property('token');
          expect(res.body.status).to.deep.equal('fail');
          done();
        });
    });
    it('should return an error if any user detail is empty', (done) => {
      const userDetails = {
        username: 'Thomas',
        password: '',
        email: 'tommy@wemail.com',
      };
      chai.request(app).post('/api/v1/auth/signup')
        .send(userDetails)
        .end((err, res) => {
          expect(res.status).to.deep.equal(400);
          expect(res.body).to.be.an('object');
          expect(res.body).to.not.have.property('token');
          expect(res.body.status).to.deep.equal('fail');
          done();
        });
    });
  });
  describe('Test to login a user', () => {
    it('should log a user in when correct details are given', (done) => {
      const userDetails = {
        username: 'Thomas',
        password: 'tomnjerry',
      };
      chai.request(app).post('/api/v1/auth/login')
        .send(userDetails)
        .end((err, res) => {
          expect(res.status).to.deep.equal(200);
          expect(res.body.data).to.have.property('message');
          expect(res.body.data).to.have.property('token');
          expect(res.body.status).to.deep.equal('success');
          done();
        });
    });
    it('should send failed request when invalid username is given', (done) => {
      const userDetails = {
        username: 'Thomas?',
        password: 'tomnjerry',
      };
      chai.request(app).post('/api/v1/auth/login')
        .send(userDetails)
        .end((err, res) => {
          expect(res.status).to.deep.equal(400);
          expect(res.body.data.code).to.deep.equal(400);
          expect(res.body.data).to.have.property('message');
          expect(res.body.status).to.deep.equal('fail');
          done();
        });
    });
    it('should send failed request when invalid password is given', (done) => {
      const userDetails = {
        username: 'Thomas?',
        password: 'tomnjerrydfgeertrewdfgfd',
      };
      chai.request(app).post('/api/v1/auth/login')
        .send(userDetails)
        .end((err, res) => {
          expect(res.status).to.deep.equal(400);
          expect(res.body.data.code).to.deep.equal(400);
          expect(res.body.data).to.have.property('message');
          expect(res.body.status).to.deep.equal('fail');
          done();
        });
    });
    it('should send a failed request message when username does not exist', (done) => {
      const userDetails = {
        username: 'miagi',
        password: 'tomnjerry',
      };
      chai.request(app).post('/api/v1/auth/login')
        .send(userDetails)
        .end((err, res) => {
          expect(res.status).to.deep.equal(400);
          expect(res.body.data.code).to.deep.equal(400);
          expect(res.body.data).to.have.property('message');
          expect(res.body.status).to.deep.equal('fail');
          done();
        });
    });
  });
  describe('Test to signup an admin', () => {
    it('should signup an admin when correct details are given', (done) => {
      const userDetails = {
        username: process.env.ADMIN,
        password: 'password',
        email: 'shazam@wemail.com',
      };
      chai.request(app).post('/api/v1/auth/signup')
        .send(userDetails)
        .end((err, res) => {
          expect(res.status).to.deep.equal(201);
          expect(res.body.data).to.have.property('message');
          expect(res.body.data).to.have.property('token');
          expect(res.body.status).to.deep.equal('success');
          done();
        });
    });
  });
  describe('Test to login an admin', () => {
    it('should log in an admin when correct details are given', (done) => {
      const userDetails = {
        username: process.env.ADMIN,
        password: 'password',
      };
      chai.request(app).post('/api/v1/auth/login')
        .send(userDetails)
        .end((err, res) => {
          expect(res.status).to.deep.equal(200);
          expect(res.body.data).to.have.property('message');
          expect(res.body.data).to.have.property('token');
          expect(res.body.status).to.deep.equal('success');
          done();
        });
    });
  });
});
