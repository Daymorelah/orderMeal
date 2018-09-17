import validate from 'validator';

/**
 * Trims input values from user
 * @param {object} objectWithValuesToTrim 
 */
const trimValues = (objectWithValuesToTrim) => {
  Object.keys(objectWithValuesToTrim).forEach((key) => {
    objectWithValuesToTrim[key] = objectWithValuesToTrim[key].trim();
  })
}

/** class reperesenting an handler's validation */
class Validate {
  static validateGetAnOrder(req, res, next) {
    trimValues(req.params);
    const { orderId } = req.params;
    if (orderId) {
      if (validate.isNumeric(orderId,{no_symbols: true}) && validate.isInt(orderId)) {
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
        message: 'Invalid user-input or request'
      });
    }
    
  }
}

export default Validate