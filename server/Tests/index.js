/* eslint-disable import/no-extraneous-dependencies */
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';
/* eslint-enable import/no-extraneous-dependencies */

chai.use(chaiHttp);
const { expect } = chai;

describe('Integration test for the order model', () => {
  describe('Test for handling invalid YRLs', () => {
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
          expect(res.status).to.deep.equal(200);
          expect(res.body.data.code).to.deep.equal(200);
          expect(res.body.status).to.deep.equal('success');
          expect(res.body.data).to.have.property('mealsOrdered');
          done();
        });
    });
  });
  describe('Test to create an order', () => {
    it('should create an order', (done) => {
      const userDetails = {
        name: 'jane Doe',
        meal: 'Eba',
        quantity: 2,
        drink: 'Hollandia 1ltr',
        prize: 300,
        address: 'Ajegunle, Lagos Nigeria',
      };
      chai.request(app).post('/api/v1/orders')
        .send(userDetails)
        .end((err, res) => {
          expect(res.status).to.deep.equal(200);
          expect(res.body.data.code).to.deep.equal(200);
          expect(res.body.status).to.deep.equal('success');
          expect(res.body.data).to.have.property('message');
          done();
        });
    });
    it('should send error message when ivalid object is passed', (done) => {
      const userDetails = {
        drink: 'Hollandia 1ltr',
        prize: 300,
        address: 'Ajegunle, Lagos Nigeria',
      };
      chai.request(app).post('/api/v1/orders')
        .send(userDetails)
        .end((err, res) => {
          expect(res.status).to.deep.equal(500);
          expect(res.body.status).to.deep.equal('error');
          expect(res.body).to.have.property('message');
          done();
        });
    });
  });
  describe('Tests to get a particular order', () => {
    it('should return details of the order requested', (done) => {
      chai.request(app).get('/api/v1/orders/2')
        .end((err, res) => {
          expect(res.status).to.deep.equal(200);
          expect(res.body.data.code).to.deep.equal(200);
          expect(res.body.status).to.deep.equal('success');
          expect(res.body.data).to.have.property('order');
          done();
        });
    });
    it('should return not found if the order requested for does not exist', (done) => {
      chai.request(app).get('/api/v1/orders/12')
        .end((err, res) => {
          expect(res.status).to.deep.equal(404);
          expect(res.body.data.code).to.deep.equal(404);
          expect(res.body.status).to.deep.equal('fail');
          expect(res.body.data).to.have.property('message');
          done();
        });
    });
  });
});
