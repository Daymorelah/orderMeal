import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { userNotAuthorized } from './helper';

dotenv.config();
const socialAuthSecret = process.env.SOCIAL_AUTH_SECRET;
const secret = process.env.SECRET;
const adminSecret = process.env.ADMIN_SECRET;

/**
 * scrambles string data
 * @param {string} token - input string data
 * @returns {output} - scrambled data
 */
function reverseToken(token) {
  return token.split('').reverse().join('');
}

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
    let token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (!token) {
      userNotAuthorized(res);
    } else {
      token = reverseToken(token);
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
    let token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (!token) {
      userNotAuthorized(res);
    } else {
      token = reverseToken(token);
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

  /**
   * This method generates a JWT token
   * @param {Object} payload - payload used to generate the token
   * @param {string} time = how long do you want the token to be valid. default value is 1 day.
   */
  static generateToken(payload, time, role) {
    let token = jwt.sign(payload,
      role ? adminSecret : secret,
      { expiresIn: time || '1 day' });
    token = reverseToken(token);
    return token;
  }

  /**
   * This method generates a JWT token for social authentication responses
   * @param {Object} payload - payload used to generate the token
   * @param {string} time = how long do you want the token to be valid. default value is 1 day.
   */
  static generateSocialAuthToken(payload, time) {
    let token = jwt.sign(payload, socialAuthSecret,
      { expiresIn: time });
    token = reverseToken(token);
    return token;
  }
}

export default Authenticate;
