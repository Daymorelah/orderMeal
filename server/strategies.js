import passport from 'passport';
import googleAuth from 'passport-google-oauth20';

const GoogleStrategy = googleAuth.Strategy;

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
}, (accessToken, refreshToken, profile, callback) => callback(null, profile)));

export default passport;
