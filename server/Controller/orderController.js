
import orderModel from '../Model';

class OrderController {
  static getAllOrders(req, res) {
    res.jsend.success({
      code: 200,
      mealsOrdered: orderModel,
    });
  }

  static createOrder(req, res) {
    const currentNumberOfOrders = orderModel.length;
    const orderToCreate = req.body;
    const orderCreated = {
      id: currentNumberOfOrders + 1,
      name: orderToCreate.name,
      meal: orderToCreate.meal,
      quantity: orderToCreate.quantity,
      drink: orderToCreate.drink,
      prize: orderToCreate.prize,
      address: orderToCreate.address,
    };
    new Promise((resolve) => {
      orderModel.push(orderCreated);
      if (orderModel.length > currentNumberOfOrders) resolve();
    }).then(() => {
      res.jsend.success({
        code: 200,
        message: 'Order created succesfully',
      });
    }).catch(() => res.status(500).jsend.fail({ message: 'Order could not be created' }));
  }
}

export default OrderController;
