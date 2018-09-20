
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import CryptData from '../Utilities/cryptData';
import pool from '../Model/db/connectToDb';
import queries from '../Model/queries';

dotenv.config();
const secret = process.env.SECRET;

/**
 * Class representing the user controller
 * @description usercontroller
 */
class UserController {
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
        message: 'An error occured trying to save the user\'s detail',
      });
    });
  }
}
export default UserController;
