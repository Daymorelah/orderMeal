
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
    const currentNumberOfOrders = data.length;
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
      data.push(orderCreated);
      if (data.length > currentNumberOfOrders) resolve();
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

  static getOrderHistory(req, res) {
    const paramsUserId = req.params.userId;
    const tokenUserId = req.decoded.userId;
    if (parseInt(paramsUserId, 10) === tokenUserId) {
      pool.query(`${queries.orderHistory}'${tokenUserId}'`, (err, response) => {
        if (err) {
          res.status(500).jsend.error({
            code: 500,
            message: 'Internal server Error',
          });
        } else if (response) {
          if (response.rowCount === 0) {
            res.jsend.success({
              code: 200,
              message: 'You have not created any order yet.',
              orders: null,
            });
          } else {
            res.jsend.success({
              code: 200,
              orders: response.rows,
            });
          }
        }
      });
    } else {
      res.status(400).jsend.fail({
        code: 400,
        message: 'You can only view your orders.',
      });
    }
  }
}

export default OrderController;
