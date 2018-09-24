
import { OrderController, UserController } from '../Controller';
import { Validate, Authenticate } from '../Utilities';

/**
 * Handles request
 * @param {object} app - An instance of the express module 
 */
const routes = (app) => {
  app.get('/api/v1', UserController.welcomeUSer);
  app.get('/api/v1/orders', OrderController.getAllOrders);
  app.post('/api/v1/orders', Validate.validateCreateOrder, OrderController.createOrder);
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
};

export default routes;
