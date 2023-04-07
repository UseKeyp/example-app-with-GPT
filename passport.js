const passport = require('passport');
const KeypStrategy = require('passport-keyp');

passport.use(new KeypStrategy({
  clientID: process.env.KEYP_CLIENT_ID,
  clientSecret: process.env.KEYP_CLIENT_SECRET,
  callbackURL: process.env.KEYP_CALLBACK_URL,
  userProfileURL: 'https://api.keyp.com/userinfo',
  scope: ['PROFILE', 'EMAIL']
},
(accessToken, refreshToken, profile, done) => {

    done(null, profile);
}
));

module.exports = passport;
