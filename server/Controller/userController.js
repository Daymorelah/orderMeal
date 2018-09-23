
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { CryptData } from '../Utilities';
import pool from '../Model/db/connectToDb';
import queries from '../Model/queries';

dotenv.config();
const secret = process.env.SECRET;

/**
 * Class representing the user controller
 * @description users controller
 */
class UserController {
  /**
   * @param {object} req -Request object
   * @param {object} res - Response object
   * @return {object} - Response object
   */
  static welcomeUSer(req, res) {
    res.jsend.success({
      code: 200,
      message: 'Welcome to the Order-Meal API',
    });
  }

  /**
   * @param {object} req -Request object
   * @param {object} res - Response object
   * @return {object} - Response object
   */
  static userSignUp(req, res) {
    const { username, password, email } = req.body;
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
            }, secret, { expiresIn: '1 day' });
            res.status(201).jsend.success({
              message: `User ${result.username} created successfully`,
              id: result.id,
              username: result.username,
              email: result.email,
              token,
            });
          }
        },
      );
    }).catch(() => {
      res.status(500).jsend.error({
        code: 500,
        message: 'An error occurred trying to save the user\'s detail',
      });
    });
  }

  /**
   * @param {object} req -Request object
   * @param {object} res - Response object
   * @return {object} - Response object
   */
  static userLogin(req, res) {
    const { username, password } = req.body;
    pool.query(`${queries.isUsernameValid}'${username}'`, (err, response) => {
      if (err) {
        res.status(500).jsend.error({
          code: 500,
          message: 'An error occurred trying to verify the user.',
        });
      } else if (response) {
        if (response.rows.length === 0) {
          res.status(400).jsend.fail({
            code: 400,
            message: 'Username or password is incorrect',
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
                }, secret, { expiresIn: '1 day' });
                res.jsend.success({
                  message: `User ${userGottenFromDb.username} logged in successfully`,
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
