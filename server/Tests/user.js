/* eslint-disable import/no-extraneous-dependencies */
import chai from 'chai';
import chaiHttp from 'chai-http';
import dotenv from 'dotenv';
import sinon from 'sinon';
import app from '../app';
import SendMail from '../Utilities/sendEmail';

dotenv.config();

chai.use(chaiHttp);
const { expect } = chai;


describe('Integration test for the users controller only', () => {
  describe('Test general error handling and welcome message', () => {
    it('should send an error when there is an unforeseen error', (done) => {
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
    it('should welcome the user to the API only', (done) => {
      chai.request(app).get('/api/v1')
        .end((err, res) => {
          expect(res.status).to.deep.equal(200);
          expect(res.body).to.have.property('message');
          expect(res.body.success).to.deep.equal(true);
          done();
        });
    });
  });
  describe('Test to signUp a user', () => {
    it('should create a user and send a message that initial signup was successful', async () => {
      const stubbedMethod = sinon.stub(SendMail, 'createTokenAndSendEmail').resolves(true);
      const userDetails = {
        username: 'Thomas',
        password: 'tomnjerry',
        email: 'tommy@wemail.com',
      };
      const res = await chai.request(app).post('/api/v1/auth/signup')
        .send(userDetails);
      expect(res.status).to.deep.equal(200);
      expect(res.body).to.have.property('message');
      expect(res.body.success).to.deep.equal(true);
      await stubbedMethod.reset();
    });
    it('should return an error if any user detail is not present in body', async () => {
      const userDetails = {
        username: 'Thomas',
        email: 'tommy@wemail.com',
      };
      const res = await chai.request(app).post('/api/v1/auth/signup')
        .send(userDetails);
      expect(res.status).to.deep.equal(400);
      expect(res.body).to.be.an('object');
      expect(res.body).to.not.have.property('token');
      expect(res.body.code).to.deep.equal(400);
    });
    it('should return an error if email is invalid only', async () => {
      const userDetails = {
        username: 'Thomas',
        password: 'password',
        email: 'tommywemail.com',
      };
      const res = await chai.request(app).post('/api/v1/auth/signup')
        .send(userDetails);
      expect(res.status).to.deep.equal(400);
      expect(res.body).to.be.an('object');
      expect(res.body).to.not.have.property('token');
      expect(res.body).to.not.have.property('tokenization');
      expect(res.body.success).to.deep.equal(false);
    });
    it('should return an error if username or password is invalid', async () => {
      const userDetails = {
        username: 'Thomas&',
        password: 'password',
        email: 'tommy@wemail.com',
      };
      const res = await chai.request(app).post('/api/v1/auth/signup')
        .send(userDetails);
      expect(res.status).to.deep.equal(400);
      expect(res.body).to.be.an('object');
      expect(res.body).to.not.have.property('token');
      expect(res.body.success).to.deep.equal(false);
    });
    it('should return an error if any user detail is empty', async () => {
      const userDetails = {
        username: 'Thomas',
        password: '',
        email: 'tommy@wemail.com',
      };
      const res = await chai.request(app).post('/api/v1/auth/signup')
        .send(userDetails);
      expect(res.status).to.deep.equal(400);
      expect(res.body).to.be.an('object');
      expect(res.body).to.not.have.property('token');
      expect(res.body.code).to.deep.equal(400);
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
          expect(res.body.data).to.not.have.property('pasenger');
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
});
