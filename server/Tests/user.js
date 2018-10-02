/* eslint-disable import/no-extraneous-dependencies*/
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';
/* eslint-enable import/no-extraneous-dependencies */

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
  describe('Test to signup a user', () => {
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
    it('should return forbidden request when role property is present', (done) => {
      const userDetails = {
        username: 'Thomas',
        password: '',
        email: 'tommy@wemail.com',
        role: 'user',
      };
      chai.request(app).post('/api/v1/auth/signup')
        .send(userDetails)
        .end((err, res) => {
          expect(res.status).to.deep.equal(403);
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
    it('should return forbidden request when role property is present', (done) => {
      const userDetails = {
        username: 'Thomas',
        password: 'something',
        role: 'user',
      };
      chai.request(app).post('/api/v1/auth/signup')
        .send(userDetails)
        .end((err, res) => {
          expect(res.status).to.deep.equal(403);
          expect(res.body).to.be.an('object');
          expect(res.body).to.not.have.property('token');
          expect(res.body.status).to.deep.equal('fail');
          done();
        });
    });
  });
  describe('Test to signup an admin', () => {
    it('should create an admin and send a message that the admin has ben created', (done) => {
      const userDetails = {
        username: 'Thomas2',
        password: 'tomnjerry',
        email: 'tommy2@wemail.com',
        role: 'admin',
      };
      chai.request(app).post('/api/v1/auth/admin/signup')
        .send(userDetails)
        .end((err, res) => {
          expect(res.status).to.deep.equal(201);
          expect(res.body.data).to.have.property('token');
          expect(res.body.status).to.deep.equal('success');
          expect(res.body.data.message).to.deep.equal('admin Thomas2 created successfully');
          done();
        });
    });
    it('should return an error if any required detail is not present in the body', (done) => {
      const userDetails = {
        username: 'Thomas',
        email: 'tommy@wemail.com',
      };
      chai.request(app).post('/api/v1/auth/admin/signup')
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
      chai.request(app).post('/api/v1/auth/admin/signup')
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
      chai.request(app).post('/api/v1/auth/admin/signup')
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
      chai.request(app).post('/api/v1/auth/admin/signup')
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
  describe('Test to login an admin', () => {
    it('should log in an admin when correct details are given', (done) => {
      const userDetails = {
        username: 'Thomas2',
        password: 'tomnjerry',
      };
      chai.request(app).post('/api/v1/auth/admin/login')
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
      chai.request(app).post('/api/v1/auth/admin/login')
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
      chai.request(app).post('/api/v1/auth/admin/login')
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
      chai.request(app).post('/api/v1/auth/admin/login')
        .send(userDetails)
        .end((err, res) => {
          expect(res.status).to.deep.equal(400);
          expect(res.body.data.code).to.deep.equal(400);
          expect(res.body.data).to.have.property('message');
          expect(res.body.status).to.deep.equal('fail');
          done();
        });
    });
    it('should send a failed request when any required field is missing', (done) => {
      const userDetails = {
        username: 'miagi',
      };
      chai.request(app).post('/api/v1/auth/admin/login')
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
});
