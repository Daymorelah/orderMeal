
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
    new Promise((resolve, reject) => {
      if (orderToCreate.name === undefined) reject();
      orderModel.push(orderCreated);
      if (orderModel.length > currentNumberOfOrders) resolve();
    }).then(() => {
      res.jsend.success({
        code: 200,
        message: 'Order created succesfully',
      });
    }).catch(() => res.status(500).jsend.error({
      message: 'Order could not be created',
      code: 500,
    }));
  }

  static getAnOrder(req, res) {
    const { orderId } = req.params;
    new Promise((resolve, reject) => {
      const orderRequested = orderModel.find(order => order.id === parseInt(orderId, 10));
      if (orderRequested === undefined) reject();
      else {
        resolve(orderRequested);
      }
    }).then((order) => {
      res.jsend.success({
        code: 200,
        order,
      });
    }).catch(() => res.status(404).jsend.fail({
      code: 404,
      message: 'Order requested not found',
    }));
  }
}

export default OrderController;
