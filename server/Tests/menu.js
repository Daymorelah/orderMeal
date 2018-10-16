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
  describe('Test for editing a menu item', () => {
    it('should edit a menu item when valid values are given', (done) => {
      const mealDetails = {
        meal: 'Vanilla Ice-cream',
        mealType: 'Desert',
        prize: '600',
      };
      chai.request(app).put('/api/v1/menu/1')
        .set('x-access-token', myAdminToken)
        .send(mealDetails)
        .end((err, res) => {
          expect(res.status).to.deep.equal(200);
          expect(res.body.status).to.deep.equal('success');
          expect(res.body.data).to.have.property('message');
          done();
        });
    });
    it('should send a failed request message when any required value is missing', (done) => {
      const mealDetails = {
        mealType: 'Desert',
        prize: '600',
      };
      chai.request(app).put('/api/v1/menu/1')
        .set('x-access-token', myAdminToken)
        .send(mealDetails)
        .end((err, res) => {
          expect(res.status).to.deep.equal(400);
          expect(res.body.status).to.deep.equal('fail');
          expect(res.body.data).to.have.property('message');
          done();
        });
    });
    it('should send a failed request message when prize contains an invalid value', (done) => {
      const mealDetails = {
        mealType: 'Desert',
        prize: 'g600',
        meal: 'Ice cream',
      };
      chai.request(app).put('/api/v1/menu/1')
        .set('x-access-token', myAdminToken)
        .send(mealDetails)
        .end((err, res) => {
          expect(res.status).to.deep.equal(400);
          expect(res.body.status).to.deep.equal('fail');
          expect(res.body.data).to.have.property('message');
          done();
        });
    });
    it('should send a failed request message when menu ID contains an invalid value', (done) => {
      const mealDetails = {
        mealType: 'Desert',
        prize: '600',
        meal: 'Ice cream',
      };
      chai.request(app).put('/api/v1/menu/er1')
        .set('x-access-token', myAdminToken)
        .send(mealDetails)
        .end((err, res) => {
          expect(res.status).to.deep.equal(400);
          expect(res.body.status).to.deep.equal('fail');
          expect(res.body.data).to.have.property('message');
          done();
        });
    });
    it('should send a failed request message when mealType contains an invalid value', (done) => {
      const mealDetails = {
        mealType: 'Desert<',
        prize: '600',
        meal: 'Ice cream',
      };
      chai.request(app).put('/api/v1/menu/1')
        .set('x-access-token', myAdminToken)
        .send(mealDetails)
        .end((err, res) => {
          expect(res.status).to.deep.equal(400);
          expect(res.body.status).to.deep.equal('fail');
          expect(res.body.data).to.have.property('message');
          done();
        });
    });
    it('should send a failed request message when meal contains an invalid value', (done) => {
      const mealDetails = {
        mealType: 'Desert<',
        prize: '600',
        meal: '£Ice cream',
      };
      chai.request(app).put('/api/v1/menu/1')
        .set('x-access-token', myAdminToken)
        .send(mealDetails)
        .end((err, res) => {
          expect(res.status).to.deep.equal(400);
          expect(res.body.status).to.deep.equal('fail');
          expect(res.body.data).to.have.property('message');
          done();
        });
    });
  });
  describe('Test for deleting a menu item', () => {
    it('should send a failed request message when meal ID contains an invalid value', (done) => {
      chai.request(app).delete('/api/v1/menu/e1')
        .set('x-access-token', myAdminToken)
        .end((err, res) => {
          expect(res.status).to.deep.equal(400);
          expect(res.body.status).to.deep.equal('fail');
          expect(res.body.data).to.have.property('message');
          expect(res.body.data.message).to.deep.equal('The menu ID should be an integer.');
          done();
        });
    });
    it('should send a failed request message when meal ID is not given', (done) => {
      chai.request(app).delete('/api/v1/menu/ /')
        .set('x-access-token', myAdminToken)
        .end((err, res) => {
          expect(res.status).to.deep.equal(400);
          expect(res.body.status).to.deep.equal('fail');
          expect(res.body.data).to.have.property('message');
          expect(res.body.data.message).to.deep.equal('Invalid request. All fields are required');
          done();
        });
    });
    it('should delete a menu item with the given menu ID', (done) => {
      chai.request(app).delete('/api/v1/menu/1')
        .set('x-access-token', myAdminToken)
        .end((err, res) => {
          expect(res.status).to.deep.equal(200);
          expect(res.body.status).to.deep.equal('success');
          expect(res.body.data).to.have.property('message');
          expect(res.body.data.message).to.deep.equal('Menu deleted successfully');
          done();
        });
    });
  });
});
