/* eslint-disable import/no-extraneous-dependencies*/
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';
/* eslint-enable import/no-extraneous-dependencies */

chai.use(chaiHttp);
const { expect } = chai;

describe('Integration test for the users controller', () => {
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
          expect(res.body.data.message).to.deep.equal('User Thomas created succesfully');
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
});
