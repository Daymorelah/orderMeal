
import orderModel from '../Model';

class OrderController {
  static getAllOrders(req, res) {
    res.jsend.success({
      codde: 200,
      mealsOrdered: orderModel,
    });
  }
}

export default OrderController;
