/* eslint-disable no-useless-escape */
import validate from 'validator';

/**
 * Trims input values from user
 * @param {object} objectWithValuesToTrim 
 */
const trimValues = (objectWithValuesToTrim) => {
  const trimmedValues = objectWithValuesToTrim;
  Object.keys(trimmedValues).forEach((key) => {
    trimmedValues[key] = trimmedValues[key].trim();
  });
  return trimmedValues;
};

/** class representing an handler's validation */
class Validate {
  /** 
  * @param {object} req - Request object 
  * @param {object} res - Response object
  * @param {callback} next - The callback that passes the request to the next handler
  * @returns {object} res - Response object when query is invalid
  */
  static validateGetAnOrder(req, res, next) {
    req.params = trimValues(req.params);
    const { orderId } = req.params;
    if (orderId) {
      if (validate.isNumeric(orderId, { no_symbols: true }) && validate.isInt(orderId)) {
        next();
      } else {
        res.status(400).jsend.fail({
          code: 400,
          message: 'The order requested should be an integer and contain only numbers',
        });
      }
    } else {
      res.status(400).jsend.fail({
        code: 400,
        message: 'Invalid request. User-input required',
      });
    }
  }
  /**
   * 
   * @param {object} req - Request object 
   * @param {object} res - Response object
   * @param {callback} next - The callback that passes the request to the next handler
   * @returns {object} res - Response object when query is invalid
   */
  static validateUpdateOrderStatus(req, res, next) {
    req.body = trimValues(req.body);
    req.params = trimValues(req.params);
    const { orderId } = req.params;
    const { isCompleted } = req.body;
    if (isCompleted && orderId) {
      if (validate.isNumeric(orderId, { no_symbols: true }) && validate.isInt(orderId)) {
        if (validate.isBoolean(isCompleted) && !validate.isNumeric(isCompleted)) {
          next();
        } else {
          res.status(400).jsend.fail({
            code: 400,
            message: 'Invalid request. "isCompleted" should be a boolean.',
          });
        }
      } else {
        res.status(400).jsend.fail({
          code: 400,
          message: 'The order requested should be an integer and contain only numbers',
        });
      }
    } else {
      res.status(400).jsend.fail({
        code: 400,
        message: 'Invalid request. User-inputs required',
      });
    }
  }
  /**
   * 
   * @param {object} req - Request object 
   * @param {object} res - Response object
   * @param {callback} next - The callback that passes the request to the next handler
   * @returns {object} res - Response object when query is invalid
   */
  static validateCreateOrder(req, res, next) {
    req.body = trimValues(req.body);
    const { name, meal, quantity, drink, prize, address } = req.body;
    if (name && meal && quantity && drink && prize && address) {
      if (validate.isAscii(name) && !validate.isInt(name) && validate.isAscii(meal) &&
          !validate.isInt(meal) && validate.isAscii(drink) && validate.isAscii(address)) {
        if (validate.isNumeric(quantity, { no_symbols: true }) && validate.isInt(quantity) &&
                validate.isNumeric(prize, { no_symbols: true }) && validate.isInt(prize)) {
          next();
        } else {
          res.status(400).jsend.fail({
            code: 400,
            message: 'Invalid request. Numeric fields should contain integers only.',
          });
        }
      } else {
        res.status(400).jsend.fail({
          code: 400,
          message: 'Invalid request. String fields should contain strings only.',
        });
      }
    } else {
      res.status(400).jsend.fail({
        code: 400,
        message: 'Invalid request. All fields are required.',
      });
    }
  }
  /**
   * 
   * @param {object} req - Request object 
   * @param {object} res - Response object
   * @param {callback} next - The callback that passes the request to the next handler
   * @returns {object} res - Response object when query is invalid
   */
  static validateSignup(req, res, next) {
    trimValues(req.body);
    const { username, password, email } = req.body;
    if (username && password && email) {
      if (email.match(/\w+@\w+\.\w{2,}/g) !== null) {
        if (username.search(/[^\w\.-]/g) === -1 && password.length < 20) {
          next();
        } else {
          res.status(400).jsend.fail({
            code: 400,
            message: 'Invalid username. It should contain only letters, numbers, -, . or _',
          });
        }
      } else {
        res.status(400).jsend.fail({
          code: 400,
          message: 'Please enter a valid email address',
        });
      }
    } else {
      res.status(400).jsend.fail({
        code: 400,
        message: 'All fields are required.',
      });
    }
  }

  static validateOrderHistory(req, res, next) {
    req.params = trimValues(req.params);
    const { userId } = req.params;
    if (userId) {
      if (isNaN(parseInt(userId, 10)) || (parseInt(userId, 10) < 0)) {
        res.status(400).jsend.fail({
          code: 400,
          message: 'User ID is invalid',
        });
      } else {
        next();
      }
    } else {
      res.status(400).jsend.fail({
        code: 400,
  /**
   * 
   * @param {object} req - Request object 
   * @param {object} res - Response object
   * @param {callback} next - The callback that passes the request to the next handler
   * @returns {object} res - Response object when query is invalid
   */
  static validateLogin(req, res, next) {
    req.body = trimValues(req.body);
    const { username, password } = req.body;
    if (username && password) {
      if (username.search(/[^\w\.-]/g) === -1 && password.length < 20) {
        next();
      } else {
        res.status(400).jsend.fail({
          code: 400,
          message: 'User details are invalid',
        });
      }
    } else {
      res.status(400).jsend.fail({
        code: 404,
        message: 'All fields are required',
      });
    }
  }
  /* eslint-enable no-useless-escape */

  /**
   * @param {object} err - error object
   * @param {object} req - Request object 
   * @param {object} res - Response object
   * @param {callback} next - The callback that passes the request to the next handler
   * @returns {object} res - Response object when query is invalid
   */
  static checkExpressErrors(err, req, res, next) {
    res.status(500).jsend.error({
      code: 500,
      message: 'Something failed',
    });
    next();
  }
}

export default Validate;
