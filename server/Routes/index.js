
import { OrderController } from '../Controller';

const routes = (app) => {
  app.get('/api/v1/orders', OrderController.getAllOrders);
};

export default routes;
