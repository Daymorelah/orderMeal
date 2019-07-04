import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { CryptData } from '../Utilities';
import pool from '../Model/db/connectToDb';
import queries from '../Model/queries';
import { sendServerError } from '../Utilities/helper';

dotenv.config();

/**
 * Class representing the user controller
 * @class SocialAuthController
 * @description social authentication controller
 */
class SocialAuthController {
  /* eslint-disable camelcase */
  static async googleAuth(req, res) {
    CryptData.encryptData(process.env.SECRET).then((hash) => {
      const {
        name, given_name, picture, email, email_verified,
      } = req.user._json; // eslint-disable-line no-underscore-dangle
      pool.query(queries.signup, [
        `${given_name || name}`,
        hash,
        email,
        picture,
        email_verified,
        true,
      ], (error, response) => {
        if (error) {
          res.status(400).jsend.fail({
            code: 400,
            message: 'Signup was not successful',
          });
        } else {
          const result = response.rows[0];
          const token = jwt.sign({
            userId: result.id,
            username: result.username,
          }, process.env.SECRET, { expiresIn: '1 day' });
          res.status(201).jsend.success({
            message: `${result.username} signed up successfully`,
            created: true,
            token,
          });
        }
      });
    }).catch(() => sendServerError(res));
  }
}

export default SocialAuthController;
