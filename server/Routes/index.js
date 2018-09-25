

import { OrderController, UserController, MenuController } from '../Controller';
import { Validate, Authenticate } from '../Utilities';

/**
 * Handles request
 * @param {object} app - An instance of the express module 
 */
const routes = (app) => {
  app.get('/api/v1', UserController.welcomeUSer);
  app.get('/api/v1/orders', OrderController.getAllOrders);
  app.post('/api/v1/orders',
    Authenticate.checkToken,
    Validate.validateCreateOrder,
    OrderController.createOrder);
  app.get('/api/v1/orders/:orderId', Validate.validateGetAnOrder, OrderController.getAnOrder);
  app.put('/api/v1/orders/:orderId',
    Validate.validateUpdateOrderStatus,
    OrderController.updateOrderStatus);
  app.post('/api/v1/auth/signup', Validate.validateSignup, UserController.userSignUp);
  app.get(
    '/api/v1/users/:userId/orders',
    Authenticate.checkToken,
    Validate.validateOrderHistory,
    OrderController.getOrderHistory);
  app.post('/api/v1/auth/login', Validate.validateLogin, UserController.userLogin);
  app.get('/api/v1/menu',
    Authenticate.checkToken,
    Validate.validateViewMenu,
    MenuController.getAllMenu);
  app.post('/api/v1/auth/admin/signup', Validate.validateSignup, UserController.adminSignup);
};

export default routes;
