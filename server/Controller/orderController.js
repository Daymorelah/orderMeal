
import data from '../Model/dummyModel';
import getOrder from '../Utilities/helpers';
import pool from '../Model/db/connectToDb';
import queries from '../Model/queries';

class OrderController {
  /**
   * 
   * @param {object} req - request object 
   * @param {object} res - response object
   * @returns {object} res - response from the server
   */
  static getAllOrders(req, res) {
    res.jsend.success({
      code: 200,
      mealsOrdered: data,
    });
  }

  /**
   * 
   * @param {object} req - request object 
   * @param {object} res - response object
   * @returns {object} res - response from the server
   */
  static createOrder(req, res) {
    const { name, meal, drink, address, quantity, prize } = req.body;
    const { userId } = req.decoded;
    pool.query(queries.createOrder, [`${name}`, `${meal}`, `${drink}`, `${quantity}`,
      `${prize}`, `${address}`, `${userId}`],
    (error, response) => {
      if (error) {
        res.status(500).jsend.error({
          code: 500,
          message: 'Internal server error',
        });
      } else if (response) {
        res.jsend.success({
          code: 200,
          message: 'Order created successfully',
          order: response.rows,
        });
      }
    });
  }

  /**
   * 
   * @param {object} req - request object 
   * @param {object} res - response object
   * @returns {object} res - response from the server
   */
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

  /**
   * 
   * @param {object} req - request object 
   * @param {object} res - response object
   * @returns {object} res - response from the server
   */
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
        data.splice(updatedOrder.id, 1, updatedOrder);
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
