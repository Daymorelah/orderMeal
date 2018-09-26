
import pool from '../Model/db/connectToDb';
import queries from '../Model/queries';

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
        res.status(500).jsend.error({
          code: 500,
          message: 'Internal server error',
        });
      } else if (response) {
        if (response.rowCount) {
          res.jsend.success({
            code: 200,
            message: 'Request completed successfully',
            orders: response.rows,
          });
        } else {
          res.jsend.success({
            code: 200,
            message: 'There are no orders created yet',
            orders: null,
          });
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
        if (response.rowCount) {
          res.jsend.success({
            code: 200,
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
        res.status(500).jsend.error({
          code: 500,
          message: 'Internal sever error',
        });
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
        res.status(500).jsend.error({
          code: 500,
          message: 'Internal server error.',
        });
      } else if (response) {
        if (response.rowCount) {
          pool.query(`${queries.updateOrderStatus}`,
            [`${status.toLowerCase()}`, `${orderId}`],
            (err, resp) => {
              if (err) {
                res.status(500).jsend.error({
                  code: 500,
                  message: 'Internal server error.',
                });
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
    const paramsUserId = req.params.userId;
    const tokenUserId = req.decoded.userId;
    if (parseInt(paramsUserId, 10) === tokenUserId) {
      pool.query(`${queries.orderHistory}`, [`${tokenUserId}`], (err, response) => {
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
