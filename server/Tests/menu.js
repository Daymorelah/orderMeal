/* eslint-disable import/no-extraneous-dependencies */
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';
/* eslint-enable import/no-extraneous-dependencies */

chai.use(chaiHttp);
const { expect } = chai;

describe('Integration test for the Menu controller', () => {
  let myToken;
  let myAdminToken;
  before('Create user for testing in menu controller', (done) => {
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
  before('Create admin for testing in menu controller', (done) => {
    const admin2 = {
      username: 'admin2',
      password: 'password',
      email: 'admin2@wemail.com',
      role: 'admin',
    };
    chai.request(app).post('/api/v1/auth/admin/signup')
      .send(admin2)
      .end((err, res) => {
        myAdminToken = res.body.data.token;
        done();
      });
  });
  describe('Test for viewing available menu', () => {
    it('should return null if no menu is available yet', (done) => {
      chai.request(app).get('/api/v1/menu')
        .set('x-access-token', myToken)
        .end((error, res) => {
          expect(res.status).to.deep.equal(200);
          expect(res.body.status).to.deep.equal('success');
          expect(res.body.data).to.have.property('menu');
          expect(res.body.data.menu).to.deep.equal(null);
          expect(res.body.data).to.have.property('message');
          done();
        });
    });
  });
  describe('Test for adding a meal to the menu', () => {
    it('should add a meal to the menu', (done) => {
      const mealToAdd = {
        meal: 'Ice-cream',
        mealType: 'Desert',
        prize: '400',
      };
      chai.request(app).post('/api/v1/menu')
        .set('x-access-token', myAdminToken)
        .send(mealToAdd)
        .end((err, res) => {
          expect(res.status).to.deep.equal(201);
          expect(res.body.data.code).to.deep.equal(201);
          expect(res.body.status).to.deep.equal('success');
          expect(res.body.data).to.have.property('menuCreated');
          done();
        });
    });
    it('should send a failed request message when user input is invalid', (done) => {
      const mealToAdd = {
        meal: 'Ice-cream$',
        mealType: 'Desert',
        prize: '400',
      };
      chai.request(app).post('/api/v1/menu')
        .set('x-access-token', myAdminToken)
        .send(mealToAdd)
        .end((err, res) => {
          expect(res.status).to.deep.equal(400);
          expect(res.body.data.code).to.deep.equal(400);
          expect(res.body.status).to.deep.equal('fail');
          expect(res.body.data).to.have.property('message');
          done();
        });
    });
    it('should send a failed request message when prize value is invalid', (done) => {
      const mealToAdd = {
        meal: 'Ice-cream$',
        mealType: 'Desert',
        prize: '-400',
      };
      chai.request(app).post('/api/v1/menu')
        .set('x-access-token', myAdminToken)
        .send(mealToAdd)
        .end((err, res) => {
          expect(res.status).to.deep.equal(400);
          expect(res.body.data.code).to.deep.equal(400);
          expect(res.body.status).to.deep.equal('fail');
          expect(res.body.data).to.have.property('message');
          done();
        });
    });
    it('should not return null when a menu has been created', (done) => {
      chai.request(app).get('/api/v1/menu')
        .set('x-access-token', myToken)
        .end((error, res) => {
          expect(res.status).to.deep.equal(200);
          expect(res.body.status).to.deep.equal('success');
          expect(res.body.data).to.have.property('menu');
          expect(res.body.data.menu).to.not.deep.equal(null);
          expect(res.body.data).to.have.property('message');
          done();
        });
    });
    it('should prevent users without token from accessing the route', (done) => {
      chai.request(app).get('/api/v1/menu')
        .end((error, res) => {
          expect(res.status).to.deep.equal(200);
          expect(res.body.status).to.deep.equal('success');
          expect(res.body.data).to.have.property('code');
          expect(res.body.data).to.have.property('message');
          done();
        });
    });
    it('should send a failed request when any required field is absent', (done) => {
      const mealToAdd = {
        meal: 'Ice-cream$',
        mealType: 'Desert',
      };
      chai.request(app).post('/api/v1/menu')
        .set('x-access-token', myAdminToken)
        .send(mealToAdd)
        .end((err, res) => {
          expect(res.status).to.deep.equal(400);
          expect(res.body.data.code).to.deep.equal(400);
          expect(res.body.status).to.deep.equal('fail');
          expect(res.body.data).to.have.property('message');
          done();
        });
    });
  });
});
