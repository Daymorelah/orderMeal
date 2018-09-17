
import orderModel from '../Model';
import getOrder from '../Utilities/helpers';

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
      isCompleted: false,
    };
    new Promise((resolve, reject) => {
      if (orderToCreate.name === undefined) reject();
      orderModel.push(orderCreated);
      if (orderModel.length > currentNumberOfOrders) resolve();
    }).then(() => {
      res.jsend.success({
        code: 200,
        message: 'Order created succesfully',
        orderCreated,
      });
    }).catch(() => res.status(400).jsend.error({
      message: 'Order could not be created',
      code: 400,
    }));
  }

  static getAnOrder(req, res) {
    const { orderId } = req.params;
    new Promise((resolve, reject) => {
      const orderRequested = getOrder(orderId);
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

  static updateOrderStatus(req, res) {
    const { orderId } = req.params;
    const { isCompleted } = req.body;
    new Promise((resolve, reject) => {
      const orderRequested = getOrder(orderId);
      if (orderRequested === undefined) reject();
      else {
        resolve(orderRequested);
      }
    }).then((order) => {
      const updatedOrder = order;
      if (isCompleted) {
        updatedOrder.isCompleted = isCompleted;
        orderModel.splice(updatedOrder.id, 1, updatedOrder);
      }
      res.jsend.success({
        code: 200,
        order: updatedOrder,
      });
    }).catch(() => res.status(404).jsend.fail({
      code: 404,
      message: 'Order requested not found',
    }));
  }
}

export default OrderController;
