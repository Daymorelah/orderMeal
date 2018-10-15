/* eslint-disable no-useless-escape */
import {
  checkForInteger,
  valueShouldBeInteger,
  allFieldsRequired,
  stringFieldNotValid } from './helper';

/**
 * Trims input values from user
 * @param {object} objectWithValuesToTrim - request body to trim
 * @returns {object} trimmedValues - trimmed values of the request object
 */
const trimValues = (objectWithValuesToTrim) => {
  const trimmedValues = objectWithValuesToTrim;
  Object.keys(trimmedValues).forEach((key) => {
    trimmedValues[key] = trimmedValues[key].trim();
  });
  return trimmedValues;
};

/** class representing an handler's validation 
 * @class Validate
 * @description Validation for user inputs in all requests
*/
class Validate {
  /** 
  * @param {object} req - Request object 
  * @param {object} res - Response object
  * @param {callback} next - The callback that passes the request to the next handler
  * @returns {object} res - Response object when query is invalid
  * @memberof Validate
  */
  static validateGetAnOrder(req, res, next) {
    req.params = trimValues(req.params);
    const { orderId } = req.params;
    if (orderId) {
      if (checkForInteger(orderId)) {
        next();
      } else {
        valueShouldBeInteger(res, 'order ID');
      }
    } else {
      res.status(400).jsend.fail({
        code: 400,
        message: 'Invalid request. Order ID required',
      });
    }
  }

  /**
   * 
   * @param {object} req - Request object 
   * @param {object} res - Response object
   * @param {callback} next - The callback that passes the request to the next handler
   * @returns {object} res - Response object when query is invalid
   * @memberof Validate
   */
  static validateUpdateOrderStatus(req, res, next) {
    const allowedValues = ['new', 'processing', 'cancelled', 'completed'];
    req.body = trimValues(req.body);
    req.params = trimValues(req.params);
    const { orderId } = req.params;
    const { status } = req.body;
    if (status && orderId) {
      if (checkForInteger(orderId)) {
        if (allowedValues.includes(status.toLowerCase())) {
          next();
        } else {
          res.status(400).jsend.fail({
            code: 400,
            message: 'Invalid status. Valid values are new, processing, cancelled or completed.',
          });
        }
      } else {
        valueShouldBeInteger(res, 'order ID');
      }
    } else {
      allFieldsRequired(res);
    }
  }

  /**
   * 
   * @param {object} req - Request object 
   * @param {object} res - Response object
   * @param {callback} next - The callback that passes the request to the next handler
   * @returns {object} res - Response object when query is invalid
   * @memberof Validate
   */
  static validateCreateOrder(req, res, next) {
    const { name, prize, address, phoneNumber, meal, drink, quantity } = req.body;
    req.body = trimValues(req.body);
    if (name && meal && quantity && drink && prize && address && phoneNumber) {
      if ((name.search(/[^\w\.\-]/g) === -1) && (name.search(/[^\w\.\-]/g) === -1)) {
        if (checkForInteger(prize) && checkForInteger(phoneNumber)) {
          next();
        } else {
          valueShouldBeInteger(res, 'Integer fields');
        }
      } else {
        stringFieldNotValid(res);
      }
    } else {
      allFieldsRequired(res);
    }
  }

  /**
   * 
   * @param {object} req - Request object 
   * @param {object} res - Response object
   * @param {callback} next - The callback that passes the request to the next handler
   * @returns {object} res - Response object when query is invalid
   * @memberof Validate
   */
  static validateSignup(req, res, next) {
    trimValues(req.body);
    const { username, password, email, role } = req.body;
    if (role && (role.toLowerCase() !== 'admin')) {
      res.status(400).jsend.fail({
        code: 400,
        message: 'Invalid role. Role can only be admin',
      });
    } else if (username && password && email) {
      if (email.match(/\w+@\w+\.\w{2,6}/g) !== null) {
        if (username.search(/[^\w\.\-_]/g) === -1 && password.length < 20) {
          next();
        } else {
          res.status(400).jsend.fail({
            code: 400,
            message: `Invalid username or password. It should contain only letters,
                      numbers, -, . or _`,
          });
        }
      } else {
        res.status(400).jsend.fail({
          code: 400,
          message: 'Please enter a valid email address',
        });
      }
    } else {
      allFieldsRequired(res);
    }
  }

  /**
   * 
   * @param {object} req - Request object 
   * @param {object} res - Response object
   * @param {callback} next - The callback that passes the request to the next handler
   * @returns {object} res - Response object when query is invalid
   * @memberof Validate
   */
  static validateOrderHistory(req, res, next) {
    req.params = trimValues(req.params);
    const { userId } = req.params;
    if (userId) {
      if (checkForInteger(userId)) {
        next();
      } else {
        valueShouldBeInteger(res, 'user ID');
      }
    } else {
      allFieldsRequired(res);
    }
  }

  /**
   * 
   * @param {object} req - Request object 
   * @param {object} res - Response object
   * @param {callback} next - The callback that passes the request to the next handler
   * @returns {object} res - Response object when query is invalid
   * @memberof Validate
   */
  static validateLogin(req, res, next) {
    req.body = trimValues(req.body);
    const { username, password } = req.body;
    if (username && password) {
      if (username.search(/[^\w\.\-]/g) === -1 && password.length < 20) {
        next();
      } else {
        res.status(400).jsend.fail({
          code: 400,
          message: 'User details are invalid',
        });
      }
    } else {
      allFieldsRequired(res);
    }
  }

  /**
   * 
   * @param {object} req - Request object 
   * @param {object} res - Response object
   * @param {callback} next - The callback that passes the request to the next handler
   * @returns {object} res - Response object when query is invalid
   * @memberof Validate
   */
  static checkRoleForUser(req, res, next) {
    req.body = trimValues(req.body);
    const { role } = req.body;
    if (role) {
      res.status(403).jsend.fail({
        code: 403,
        message: 'Forbidden parameter, (role), in request',
      });
    } else {
      next();
    }
  }

  /**
   * @param {object} req - Request object 
   * @param {object} res - Response object
   * @param {callback} next - The callback that passes the request to the next handler
   * @returns {object} res - Response object when query is invalid
   * @memberof Validate
   */
  static validateViewMenu(req, res, next) {
    req.query = trimValues(req.query);
    const { filter } = req.query;
    if (filter) {
      if (filter.search(/[^\w]/g) === -1) {
        next();
      } else {
        res.status(400).jsend.fail({
          code: 400,
          message: 'Invalid query param \'filter\'',
        });
      }
    } else {
      next();
    }
  }

  /**
   * @param {object} req - Request object 
   * @param {object} res - Response object
   * @param {callback} next - The callback that passes the request to the next handler
   * @returns {object} res - Response object when query is invalid
   * @memberof Validate
   */
  static validateAddMealTOMenu(req, res, next) {
    req.body = trimValues(req.body);
    const { meal, prize, mealType } = req.body;
    if (meal && prize && mealType) {
      if ((meal.search(/[^\w\s\.\-]/g) === -1) && (mealType.search(/[^\w\.\-]/g) === -1)) {
        if (checkForInteger(prize)) {
          next();
        } else {
          valueShouldBeInteger(res, 'prize field');
        }
      } else {
        res.status(400).jsend.fail({
          code: 400,
          message: 'Meal and mealType must contain letters and/or numbers.',
        });
      }
    } else {
      allFieldsRequired(res);
    }
  }

  /* eslint-enable no-useless-escape */
  /**
   * @param {object} err - error object
   * @param {object} req - Request object 
   * @param {object} res - Response object
   * @param {callback} next - The callback that passes the request to the next handler
   * @returns {object} res - Response object when query is invalid
   * @memberof Validate
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
