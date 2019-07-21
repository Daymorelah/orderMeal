
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { CryptData } from '../Utilities';
import pool from '../Model/db/connectToDb';
import queries from '../Model/queries';
import { sendServerError, redirectUser } from '../Utilities/helper';
import SendEmail from '../Utilities/sendEmail';
import Authenticate from '../Utilities/tokenAuth';

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
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @return {res} - Response object
   * @memberof USerController
   */
  static welcomeUser(req, res) {
    res.json({
      success: true,
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
  static async userSignUp(req, res) {
    const { username, password, email } = req.body;
    try {
      const queryResult = await pool.query(queries.doesEmailExist, [email]);
      if (queryResult.rows.length) {
        if (!queryResult.rows[0].is_email_verified) {
          const isEmailSent = await SendEmail.createTokenAndSendEmail(queryResult.rows[0]);
          if (isEmailSent) {
            return res.status(200).json({
              success: true,
              message: 'You had started the registration '
              + 'process earlier. '
              + 'An email has been sent to your email address. '
              + 'Please check your email to complete your registration.',
            });
          }
          return res.status(500).json({
            success: false,
            message: 'Your registration could not be completed.'
            + ' Please try again',
          });
        }
        return res.status(200).json({
          success: true,
          message: 'You are a registered user on '
          + 'this platform. Please proceed to login',
        });
      }
      return CryptData.encryptData(password).then((hash) => {
        pool.query(queries.signup, [
          username,
          hash,
          email,
          null,
          false,
          false,
        ],
        async (error, response) => {
          if (error) {
            return res.status(409).json({
              success: false,
              message: 'User details already exist. Signup was not successful',
            });
          }
          const isEmailSent = await SendEmail.createTokenAndSendEmail(response.rows[0]);
          if (isEmailSent) {
            return res.status(200).json({
              success: true,
              message: 'Your initial signup process was successful. '
              + 'An email has been sent to your email address. Please check your email to complete your registration',
            });
          }
          return res.status(400).json({
            success: false,
            message: 'Could not complete the initial signup process. '
            + 'Please try again.',
          });
        });
      });
    } catch (err) {
      return sendServerError(res);
    }
  }

  static async verifyUserEmail(req, res) {
    const { username } = req.decoded;
    pool.query(queries.verifyUserEmail, [true, username],
      async (error, response) => {
        try {
          if (error) {
            return res.status(500).json({
              success: false,
              message: 'Could not verify your email address at this time. Please try again',
            });
          }
          if (response.rowCount === 1) {
            const { id, email } = response.rows[0];
            const isEmailSent = await SendEmail.confirmRegistrationComplete(email);
            if (isEmailSent) {
              const token = Authenticate.generateToken({
                success: true,
                id,
                username: response.rows[0].username,
                message: 'Your email has been verified.',
              }, '7d');
              redirectUser(res, token);
            }
            return res.status(200).json({
              success: true,
              message: 'Your email has been verified but our servers could not send you a confirmation email. You can proceed to login',
            });
          }
          return res.status(400).json({
            success: false,
            message: 'Your request is not valid. It may have been tampered with.',
          });
        } catch (err) {
          return sendServerError(res);
        }
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
    const { username, password } = req.body;
    const role = username === process.env.ADMIN ? 'Admin' : undefined;
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
                  verified: role ? true : undefined,
                }, role ? adminSecret : secret, { expiresIn: '1 day' });
                const sendUserDetails = {
                  message: `${role || 'User'} ${userGottenFromDb.username} logged in successfully`,
                  id: userGottenFromDb.id,
                  username: userGottenFromDb.username,
                  email: userGottenFromDb.email,
                  token,
                };
                res.jsend.success(sendUserDetails);
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
