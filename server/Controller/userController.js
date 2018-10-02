
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { CryptData } from '../Utilities';
import pool from '../Model/db/connectToDb';
import queries from '../Model/queries';
import { sendServerError } from '../Utilities/helper';

dotenv.config();
const secret = process.env.SECRET;
const adminSecret = process.env.ADMIN_SECRET;

/**
 * Class representing the user controller
 * @class USerController
 * @description users controller
 */
class UserController {
  /**
   * Welcomes user to the API
   * Route: GET: /
   * @param {object} req -Request object
   * @param {object} res - Response object
   * @return {res} - Response object
   * @memberof USerController
   */
  static welcomeUSer(req, res) {
    res.jsend.success({
      code: 200,
      message: 'Welcome to the Order-Meal API',
    });
  }

  /**
   * Sign up a user
   * Route: POST: /auth/signup
   * @param {object} req -Request object
   * @param {object} res - Response object
   * @return {res} res - Response object
   * @memberof USerController
   */
  static userSignUp(req, res) {
    const { username, password, email, role } = req.body;
    let encryptedPassword;
    CryptData.encryptData(password).then((hash) => {
      encryptedPassword = hash;
      pool.query(queries.signup, [username, encryptedPassword, email],
        (error, response) => {
          if (error) {
            res.status(409).jsend.fail({
              code: 409,
              message: 'User details already exist. Signup was not successful',
            });
          } else {
            const result = response.rows[0];
            const token = jwt.sign({
              userId: result.id,
              username: result.username,
              email: result.email,
            }, role === 'admin' ? adminSecret : secret, { expiresIn: '1 day' });
            res.status(201).jsend.success({
              message: `${role || 'User'} ${result.username} created successfully`,
              id: result.id,
              username: result.username,
              email: result.email,
              token,
            });
          }
        },
      );
    }).catch(() => {
      sendServerError(res);
    });
  }

  /**
   * Log in a user
   * Route: POST: /auth/login
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @return {res} res - Response object
   * @memberof USerController
   */
  static userLogin(req, res) {
    const { username, password, role } = req.body;
    pool.query(`${queries.isUsernameValid}`, [`${username}`], (err, response) => {
      if (err) {
        sendServerError(res);
      } else if (response) {
        if (!response.rowCount) {
          res.status(400).jsend.fail({
            code: 400,
            message: 'Username or password is invalid',
          });
        } else {
          const userGottenFromDb = response.rows[0];
          CryptData.decryptData(password, userGottenFromDb.password)
            .then((isPasswordCorrect) => {
              if (isPasswordCorrect) {
                const token = jwt.sign({
                  userId: userGottenFromDb.id,
                  username: userGottenFromDb.username,
                  email: userGottenFromDb.email,
                }, role === 'admin' ? adminSecret : secret, { expiresIn: '1 day' });
                res.jsend.success({
                  message: `${role || 'User'} ${userGottenFromDb.username} logged in successfully`,
                  id: userGottenFromDb.id,
                  username: userGottenFromDb.username,
                  email: userGottenFromDb.email,
                  token,
                });
              } else {
                res.status(400).jsend.fail({
                  code: 400,
                  message: 'Username or password is incorrect',
                });
              }
            }).catch(() => {
              res.status(500).jsend.error({
                code: 500,
                message: 'Server error. Could not verify the user.',
              });
            });
        }
      }
    });
  }
}

export default UserController;
