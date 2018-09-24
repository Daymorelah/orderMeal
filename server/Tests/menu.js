/* eslint-disable import/no-extraneous-dependencies */
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';
/* eslint-enable import/no-extraneous-dependencies */

chai.use(chaiHttp);
const { expect } = chai;

describe('Integration test for the Menu controller', () => {
  let myToken;
  before('Create user for testing', (done) => {
    const user1 = {
      username: 'Donnie2',
      password: 'password',
      email: 'donnie2@wemail.com',
    };
    chai.request(app).post('/api/v1/auth/signup')
      .send(user1)
      .end((err, res) => {
        myToken = res.body.data.token;
        done();
      });
  });
  describe('Test for viewing available menu', () => {
    it('should return null if no menu is available yet', () => {
      chai.request(app).get('/api/v1/menu')
        .set('x-access-token', myToken)
        .end((error, res) => {
          expect(res.status).to.deep.equal(200);
          expect(res.body.status).to.decrease.equal('success');
          expect(res.body.data).to.have.property('menu');
          expect(res.body.data.menu).to.deep.equal(null);
          expect(res.body.data).to.have.property('message');
        });
    });
  });
});
