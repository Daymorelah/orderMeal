import dotenv from 'dotenv';
import passport from 'passport';
import {
  OrderController, UserController, MenuController, SocialAuthController,
} from '../Controller';
import { Validate, Authenticate } from '../Utilities';

dotenv.config();

/**
 * Handles request
 * @param {object} app - An instance of the express module
 */
const routes = (app) => {
  app.get('/api/v1', UserController.welcomeUser);
  app.get('/api/v1/orders',
    Authenticate.checkAdminToken,
    OrderController.getAllOrders);
  app.post('/api/v1/orders',
    Authenticate.checkToken,
    Validate.validateCreateOrder,
    OrderController.createOrder);
  app.get('/api/v1/orders/:orderId',
    Authenticate.checkAdminToken,
    Validate.validateGetAnOrder,
    OrderController.getAnOrder);
  app.put('/api/v1/orders/:orderId',
    Authenticate.checkAdminToken,
    Validate.validateUpdateOrderStatus,
    OrderController.updateOrderStatus);
  app.post('/api/v1/auth/signup',
    Validate.validateSignup,
    UserController.userSignUp);
  app.get(
    '/api/v1/users/:userId/orders',
    Authenticate.checkToken,
    Validate.validateOrderHistory,
    OrderController.getOrderHistory,
  );
  app.post('/api/v1/auth/login',
    Validate.validateLogin,
    UserController.userLogin);
  app.get('/api/v1/menu',
    Validate.validateViewMenu,
    MenuController.getAllMenu);
  app.post('/api/v1/menu',
    Authenticate.checkAdminToken,
    Validate.validateAddMealTOMenu,
    MenuController.addMealToMenu);
  app.put('/api/v1/menu/:menuId',
    Authenticate.checkAdminToken,
    Validate.validateEditMenuItem,
    MenuController.editMenuItem);
  app.delete('/api/v1/menu/:menuId',
    Authenticate.checkAdminToken,
    Validate.validateDeleteMenuItem,
    MenuController.deleteMenuItem);
  app.get('/api/v1/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] }));
  app.get('/api/v1/auth/callback',
    passport.authenticate('google', {
      session: false,
      failureRedirect: '/api/v1/auth/failed',
    }),
    SocialAuthController.googleAuth);
  app.get('/api/v1/auth/failed', (req, res) => {
    res.send({ message: 'Social authentication failed. You can try again.' });
  });
  app.get('/api/v1/signup/verify',
    Authenticate.checkToken,
    UserController.verifyUserEmail);
};

export default routes;
