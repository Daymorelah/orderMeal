import sendGrid from '@sendgrid/mail';
import dotEnv from 'dotenv';
import Authentication from './tokenAuth';

dotEnv.config();
let baseUrl = '';

if (process.env.NODE_ENV !== 'production') {
  baseUrl = process.env.SEND_GRID_URL;
} else {
  baseUrl = process.env.SEND_GRID_PRODUCTION_URL;
}

/**
 * @description utility to send mails
 */
class SendEmail {
  /**
   * This method creates a temporary token and then
   * sends an email to the user.
   * @param {object} userDetails - An object containing details of the
   * user we want to send an email to.
   * @returns {boolean} isEmailSent - Tells if email was actually sent
   */
  static async createTokenAndSendEmail(userDetails) {
    try {
      const { id, username, email } = userDetails;
      const tokenCreated = await
      Authentication
        .generateToken({ id, username });

      if (tokenCreated) {
        const isEmailSent = await
        SendEmail.verifyEmail(email, tokenCreated);
        return isEmailSent;
      }
      return false;
    } catch (err) {
      throw (err);
    }
  }

  /**
   * @param {string} email - email address to send the message to
   * @param {string} token - Token generated during signup
   * @returns {boolean} specifies if the email was sent successfully
   */
  static verifyEmail(email, token) {
    const details = {
      email,
      subject: 'Email Verification - O-meal',
      emailBody: `<p>Thank you for signing up with O-meal.</p>
        <p>Next step is to verify this email
        address by clicking the link below.</p>
        <br/><p>
        <a href=${baseUrl}/signup/verify?token=${token}>
        Complete your registration </a><<< </p>`,
    };
    return SendEmail.emailSender(details);
  }

  /**
   * This function sends an email on verification of email address
   * @param {string} email - email address to send the message to
   * @returns {boolean} specifies if a verification email was sent to user
   * after registration
  */
  static confirmRegistrationComplete(email) {
    const details = {
      email,
      subject: 'Registration Complete - O-Meal',
      emailBody: `<p>Your registration has been completed<p>
      <p>Thank you for registering with Authors Haven.</p>
      <p> >>>
      <a href=${baseUrl}/home>
      Go to your profile </a> <<< </p>`,
    };
    return SendEmail.emailSender(details);
  }

  /**
   *
   * @param {object} details - Object containing info for sending email
   * @returns {boolean} sends email to users
   */
  static async emailSender(details) {
    sendGrid.setApiKey(process.env.SEND_GRID_API_KEY);
    const msg = {
      from: process.env.MAIL_MASTER,
      html: details.emailBody,
      subject: details.subject,
      to: details.email,
    };
    try {
      const isEmailSent = await sendGrid.send(msg);
      if (isEmailSent) return true;
      return false;
    } catch (error) {
      return false;
    }
  }
}

export default SendEmail;
