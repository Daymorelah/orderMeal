
import { OrderController } from '../Controller';
import Validate from '../Utilities/validateInputs';

const routes = (app) => {
  app.get('/api/v1/orders', OrderController.getAllOrders);
  app.post('/api/v1/orders', Validate.validateCreateOrder, OrderController.createOrder);
  app.get('/api/v1/orders/:orderId', Validate.validateGetAnOrder, OrderController.getAnOrder);
  app.put('/api/v1/orders/:orderId',
    Validate.validateUpdateOrderStatus,
    OrderController.updateOrderStatus);
  app.post('/api/v1/auth/signup', Validate.validateSignup);
};

export default routes;
