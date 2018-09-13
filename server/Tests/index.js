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
});
