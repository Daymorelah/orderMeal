import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const secret = process.env.SECRET;

/**
 * Class repesenting authenticating a request form a user
 */
class Authenticate {
  /**
   * 
   * @param {object} req - Request object 
   * @param {object} res - Response object
   * @param {callback} next - The callback that passes the request to the next handler
   */
  static checkToken(req, res, next) {
    const token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (!token) {
      res.status(401).jsend.fail({
        code: 401,
        message: 'User not auhorized',
      });
    } else {
      jwt.verify(token, secret, (err, decoded) => {
        if (err) {
          res.status(401).jsend.fail({
            code: 401,
            message: 'Authentication failed',
          });
        } else {
          req.decoded = decoded;
          next();
        }
      });
    }
  }
}

export default Authenticate;
