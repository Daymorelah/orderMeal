
import pool from '../Model/db/connectToDb';
import queries from '../Model/queries';
import { sendServerError, noValuesYet } from '../Utilities/helper';

/**
 * Class representing the order controller
 * @class Order controller
 * @description order controller
 */
class OrderController {
  /**
   * Get All Orders
   * Route: GET: /orders
   * @param {object} req - request object 
   * @param {object} res - response object
   * @returns {res} res - response from the server
   * @memberof OrderController
   */
  static getAllOrders(req, res) {
    pool.query(queries.getAllOrders, (error, response) => {
      if (error) {
        sendServerError(res);
      } else if (response) {
        if (response.rowCount) {
          res.jsend.success({
            code: 200,
            message: 'Request completed successfully',
            orders: response.rows,
          });
        } else {
          noValuesYet(res, 'orders created');
        }
      }
    });
  }
  /**
   * Create An Order
   * Route: POST: /orders
   * @param {object} req - request object 
   * @param {object} res - response object
   * @returns {res} res - response from the server
   * @memberof OrderController
   */
  static createOrder(req, res) {
    const { address, name, quantity, prize, meal, drink } = req.body;
    const { userId } = req.decoded;
    pool.query(queries.createOrder, [`${name}`, `${meal}`, `${drink}`, `${quantity}`,
      `${prize}`, `${address}`, `${userId}`],
    (error, response) => {
      if (error) {
        sendServerError(res);
      } else if (response) {
        if (response.rowCount) {
          res.status(201).jsend.success({
            code: 201,
            message: 'Order created successfully',
            order: response.rows,
          });
        }
      }
    });
  }
  /**
   * Get A Particular Order
   * Route: GET: /orders/:orderId
   * @param {object} req - request object 
   * @param {object} res - response object
   * @returns {res} res - response from the server
   * @memberof OrderController
   */
  static getAnOrder(req, res) {
    const { orderId } = req.params;
    pool.query(`${queries.getAnOrder}`, [`${orderId}`], (err, response) => {
      if (err) {
        sendServerError(res);
      } else if (response) {
        if (response.rowCount) {
          res.jsend.success({
            code: 200,
            order: response.rows,
          });
        } else {
          res.status(404).jsend.fail({
            code: 404,
            message: 'The order requested for does not exist',
          });
        }
      }
    });
  }
  /**
   * Update The Status Of An Order
   * Route: PUT: /orders/:orderId
   * @param {object} req - request object 
   * @param {object} res - response object
   * @returns {res} res - response from the server
   * @memberof OrderController
   */
  static updateOrderStatus(req, res) {
    const { orderId } = req.params;
    const { status } = req.body;
    pool.query(`${queries.isOrderValid}`, [`${orderId}`], (error, response) => {
      if (error) {
        sendServerError(res);
      }
      if (response) {
        if (response.rowCount) {
          pool.query(`${queries.updateOrderStatus}`,
            [`${status.toLowerCase()}`, `${orderId}`],
            (err, resp) => {
              if (err) {
                sendServerError(res);
              } else if (resp) {
                if (resp.rowCount) {
                  res.jsend.success({
                    code: 200,
                    message: 'Update was successful',
                    order: resp.rows,
                  });
                }
              }
            });
        } else {
          res.status(404).jsend.fail({
            code: 404,
            message: 'Order requested is not found',
          });
        }
      }
    });
  }
  /**
   * Get The Order History Of A User
   * Route: GET: /users/:userId/orders
   * @param {object} req - request object 
   * @param {object} res - response object
   * @returns {res} res - response from the server
   * @memberof OrderController
   */
  static getOrderHistory(req, res) {
    if (parseInt(req.params.userId, 10) === req.decoded.userId) {
      pool.query(`${queries.orderHistory}`, [`${req.decoded.userId}`], (err, response) => {
        if (err) {
          sendServerError(res);
        } else if (response) {
          if (response.rowCount === 0) {
            noValuesYet(res, 'orders created');
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
