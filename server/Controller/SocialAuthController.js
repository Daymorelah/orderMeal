import dotenv from 'dotenv';
import { CryptData } from '../Utilities';
import pool from '../Model/db/connectToDb';
import queries from '../Model/queries';
import { sendServerError, redirectUser } from '../Utilities/helper';
import SendEmail from '../Utilities/sendEmail';
import Authenticate from '../Utilities/tokenAuth';

dotenv.config();

/**
 * Class representing the user controller
 * @class SocialAuthController
 * @description social authentication controller
 */
class SocialAuthController {
  /* eslint-disable camelcase, no-underscore-dangle */
  static async googleAuth(req, res) {
    try {
      const queryResult = await pool.query(queries.doesEmailExist, [req.user._json.email]);
      if (queryResult.rows.length) {
        if (!queryResult.rows[0].is_email_verified) {
          const isEmailSent = await SendEmail.createTokenAndSendEmail(queryResult.rows[0]);
          if (isEmailSent) {
            const token = Authenticate.generateSocialAuthToken({
              success: true,
              message: 'You had started the registration '
              + 'process earlier. '
              + 'An email has been sent to your email address. '
              + 'Please check your email to complete your registration.',
            }, 50);
            return redirectUser(res, token, 'signup');
          }
          const token = Authenticate.generateSocialAuthToken({
            success: false,
            message: 'Your registration could not be completed.'
            + ' Please try again',
          }, 50);
          return redirectUser(res, token);
        }
        const token = Authenticate.generateSocialAuthToken({
          success: true,
          message: 'You are a registered user on '
          + 'this platform. Please proceed to login',
        }, 50);
        return redirectUser(res, token, 'signup');
      }
      const {
        name, given_name, picture, email, email_verified,
      } = req.user._json;
      return CryptData.encryptData(process.env.SECRET).then((hash) => {
        pool.query(queries.signup, [
          `${given_name || name}`,
          hash,
          email,
          picture,
          email_verified,
          true,
        ], async (error, response) => {
          if (!email_verified) {
            const isEmailSent = await SendEmail.createTokenAndSendEmail(response.rows[0]);
            if (isEmailSent) {
              const token = Authenticate.generateSocialAuthToken({
                success: true,
                message: 'Your initial signup process was successful. '
                + 'An email has been sent to your email address. Please check your email to complete your registration',
              }, 50);
              return redirectUser(res, token, 'signup');
            }
            const token = Authenticate.generateSocialAuthToken({
              success: false,
              message: 'Could not complete the initial signup process. '
              + 'Please try again.',
            }, 50);
            return redirectUser(res, token, 'signup');
          }
          const token = Authenticate.generateSocialAuthToken({
            id: response.rows[0].id,
            username: response.rows[0].username,
            success: true,
            message: 'Your signup process was successful.',
          }, 50);
          return redirectUser(res, token, 'menu');
        });
      });
    } catch (err) {
      return sendServerError(res);
    }
  }
}

export default SocialAuthController;
