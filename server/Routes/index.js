

import { OrderController, UserController, MenuController } from '../Controller';
import { Validate, Authenticate } from '../Utilities';

/**
 * Handles request
 * @param {object} app - An instance of the express module 
 */
const routes = (app) => {
  app.get('/api/v1', UserController.welcomeUSer);
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
    OrderController.getOrderHistory);
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
};

export default routes;
