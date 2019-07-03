import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { userNotAuthorized } from './helper';

dotenv.config();
const secret = process.env.SECRET;
const adminSecret = process.env.ADMIN_SECRET;

/**
 * Class representing authenticating a request form a user
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
      userNotAuthorized(res);
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

  /**
   *
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @param {callback} next - The callback that passes the request to the next handler
   */
  static checkAdminToken(req, res, next) {
    const token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (!token) {
      userNotAuthorized(res);
    } else {
      jwt.verify(token, adminSecret, (err, decoded) => {
        if (err) {
          res.status(403).jsend.fail({
            code: 403,
            message: 'User not allowed to access this route.',
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
