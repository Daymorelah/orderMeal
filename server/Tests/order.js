/* eslint-disable import/no-extraneous-dependencies */
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';
/* eslint-enable import/no-extraneous-dependencies */

chai.use(chaiHttp);
const { expect } = chai;

describe('Integration test for the order model', () => {
  let myToken;
  before('Create user for testing', (done) => {
    const user1 = {
      username: 'Donnie',
      password: 'password',
      email: 'donnie@wemail.com',
    };
    chai.request(app).post('/api/v1/auth/signup')
      .send(user1)
      .end((err, res) => {
        myToken = res.body.data.token;
        done();
      });
  });
  describe('Test for handling invalid URLs', () => {
    it('should return a page not found for invalid URLs', (done) => {
      chai.request(app).get('/api/v1/order')
        .end((err, res) => {
          expect(res.status).to.deep.equal(404);
          expect(res.body.code).to.deep.equal(404);
          expect(res.body.status).to.deep.equal('error');
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.deep.equal('Page not found');
          done();
        });
    });
  });
  describe('Test to get all orders', () => {
    it('should return all orders', (done) => {
      chai.request(app).get('/api/v1/orders')
        .end((err, res) => {
          expect(res.body.data.code).to.deep.equal(200);
          expect(res.body.data).to.have.property('mealsOrdered');
          expect(res.body.status).to.deep.equal('success');
          done();
        });
    });
  });
  describe('Test to create an order', () => {
    it('should create an order', (done) => {
      const userDetails = {
        name: 'jane_Doe',
        meal: 'Eba',
        quantity: '2',
        drink: 'Hollandia 1ltr',
        prize: '3',
        address: 'Ajegunle, Lagos Nigeria',
      };
      chai.request(app).post('/api/v1/orders')
        .set('x-access-token', myToken)
        .send(userDetails)
        .end((err, res) => {
          expect(res.status).to.deep.equal(200);
          expect(res.body.data.code).to.deep.equal(200);
          expect(res.body.status).to.deep.equal('success');
          expect(res.body.data).to.have.property('message');
          expect(res.body.data).to.have.property('order');
          done();
        });
    });
    it('should return invalid request when a string field has a non-string value', (done) => {
      const userDetails = {
        name: 'jane_Doe?',
        meal: '55',
        quantity: '2',
        drink: 'Hollandia 1ltr',
        prize: '300',
        address: 'Ajegunle, Lagos Nigeria',
      };
      chai.request(app).post('/api/v1/orders')
        .set('x-access-token', myToken)
        .send(userDetails)
        .end((err, res) => {
          expect(res.status).to.deep.equal(400);
          expect(res.body.data.code).to.deep.equal(400);
          expect(res.body.status).to.deep.equal('fail');
          expect(res.body.data).to.have.property('message');
          done();
        });
    });
    it('should return invalid request when an integer field has a non-integer value', (done) => {
      const userDetails = {
        name: 'jane Doe',
        meal: 'Eba',
        quantity: '2',
        drink: 'Hollandia 1ltr',
        prize: 'too costly',
        address: 'Ajegunle, Lagos Nigeria',
      };
      chai.request(app).post('/api/v1/orders')
        .set('x-access-token', myToken)
        .send(userDetails)
        .end((err, res) => {
          expect(res.status).to.deep.equal(400);
          expect(res.body.data.code).to.deep.equal(400);
          expect(res.body.status).to.deep.equal('fail');
          expect(res.body.data).to.have.property('message');
          done();
        });
    });
    it('should send error message when invalid object is passed', (done) => {
      const userDetails = {
        drink: 'Hollandia 1ltr',
        prize: '300',
        address: 'Ajegunle, Lagos Nigeria',
      };
      chai.request(app).post('/api/v1/orders')
        .set('x-access-token', myToken)
        .send(userDetails)
        .end((err, res) => {
          expect(res.status).to.deep.equal(400);
          expect(res.body.status).to.deep.equal('fail');
          expect(res.body.data).to.have.property('message');
          done();
        });
    });
  });
  describe('Tests to get a particular order', () => {
    it('should return details of the order requested', (done) => {
      chai.request(app).get('/api/v1/orders/2')
        .end((err, res) => {
          expect(res.body.data).to.have.property('order');
          expect(res.status).to.deep.equal(200);
          expect(res.body.status).to.deep.equal('success');
          expect(res.body.data.code).to.deep.equal(200);
          done();
        });
    });
    it('should return invalid request when order requested is not given', (done) => {
      chai.request(app).get('/api/v1/orders/ /')
        .end((err, res) => {
          expect(res.body.data).to.have.property('message');
          expect(res.status).to.deep.equal(400);
          expect(res.body.status).to.deep.equal('fail');
          expect(res.body.data.code).to.deep.equal(400);
          done();
        });
    });
    it('should return invalid request when orderId is not an integer', (done) => {
      chai.request(app).get('/api/v1/orders/we/')
        .end((err, res) => {
          expect(res.body.data).to.have.property('message');
          expect(res.status).to.deep.equal(400);
          expect(res.body.status).to.deep.equal('fail');
          expect(res.body.data.code).to.deep.equal(400);
          done();
        });
    });
    it('should return not found if the order requested for does not exist', (done) => {
      chai.request(app).get('/api/v1/orders/12')
        .end((err, res) => {
          expect(res.status).to.deep.equal(404);
          expect(res.body.status).to.deep.equal('fail');
          expect(res.body.data.code).to.deep.equal(404);
          expect(res.body.data).to.have.property('message');
          done();
        });
    });
  });
  describe('Tests to update status of an order', () => {
    it('should update the status of a order', (done) => {
      const userDetails = {
        isCompleted: 'true',
      };
      chai.request(app).put('/api/v1/orders/3')
        .send(userDetails)
        .end((err, res) => {
          expect(res.status).to.deep.equal(200);
          expect(res.body.data.code).to.deep.equal(200);
          expect(res.body.status).to.deep.equal('success');
          expect(res.body.data).to.have.property('order');
          done();
        });
    });
    it('should return invalid request when request body is not a boolean', (done) => {
      const userDetails = {
        isCompleted: '1',
      };
      chai.request(app).put('/api/v1/orders/wrong')
        .send(userDetails)
        .end((err, res) => {
          expect(res.status).to.deep.equal(400);
          expect(res.body.data.code).to.deep.equal(400);
          expect(res.body.status).to.deep.equal('fail');
          expect(res.body.data).to.have.property('message');
          done();
        });
    });
    it('should return invalid request when orderId is not an integer', (done) => {
      const userDetails = {
        isCompleted: 'true',
      };
      chai.request(app).put('/api/v1/orders/wrong')
        .send(userDetails)
        .end((err, res) => {
          expect(res.status).to.deep.equal(400);
          expect(res.body.data.code).to.deep.equal(400);
          expect(res.body.status).to.deep.equal('fail');
          expect(res.body.data).to.have.property('message');
          done();
        });
    });
    it('should return invalid request when request body is an empty object', (done) => {
      chai.request(app).put('/api/v1/orders/3')
        .send({})
        .end((err, res) => {
          expect(res.status).to.deep.equal(400);
          expect(res.body.data.code).to.deep.equal(400);
          expect(res.body.status).to.deep.equal('fail');
          expect(res.body.data).to.have.property('message');
          done();
        });
    });
    it('should return not found when order requested is invalid', (done) => {
      const userDetails = {
        isCompleted: 'true',
      };
      chai.request(app).put('/api/v1/orders/14')
        .send(userDetails)
        .end((err, res) => {
          expect(res.body.status).to.deep.equal('fail');
          expect(res.body.data).to.have.property('message');
          expect(res.status).to.deep.equal(404);
          expect(res.body.data.code).to.deep.equal(404);
          done();
        });
    });
  });
  describe('Test to get history of orders', () => {
    it('should return null when user has no orders yet.', (done) => {
      chai.request(app).get('/api/v1/users/2/orders')
        .set({ 'x-access-token': myToken })
        .end((err, res) => {
          expect(res.status).to.deep.equal(200);
          expect(res.body.status).to.deep.equal('success');
          expect(res.body.data).to.have.property('message');
          expect(res.body.data.orders).to.deep.equal(null);
          done();
        });
    });
    it('should return failed request when user ID is invalid.', (done) => {
      chai.request(app).get('/api/v1/users/-1/orders')
        .set({ 'x-access-token': myToken })
        .end((err, res) => {
          expect(res.status).to.deep.equal(400);
          expect(res.body.status).to.deep.equal('fail');
          expect(res.body.data).to.have.property('message');
          done();
        });
    });
    it('should prevent a user from viewing another user\'s orders', (done) => {
      chai.request(app).get('/api/v1/users/1/orders')
        .set({ 'x-access-token': myToken })
        .end((err, res) => {
          expect(res.status).to.deep.equal(400);
          expect(res.body.status).to.deep.equal('fail');
          expect(res.body.data).to.have.property('message');
          done();
        });
    });
  });
});
