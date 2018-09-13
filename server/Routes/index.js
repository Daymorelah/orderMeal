
import { OrderController } from '../Controller';

const routes = (app) => {
  app.get('/api/v1/orders', OrderController.getAllOrders);
  app.post('/api/v1/orders', OrderController.createOrder);
};

export default routes;
