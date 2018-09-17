
import validate from 'validator';

/**
 * Trims input values from user
 * @param {object} objectWithValuesToTrim 
 */
const trimValues = (objectWithValuesToTrim) => {
  const trimedValues = objectWithValuesToTrim;
  Object.keys(trimedValues).forEach((key) => {
    trimedValues[key] = trimedValues[key].trim();
  });
  return trimedValues;
};

/** class reperesenting an handler's validation */
class Validate {
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
}

export default Validate;
