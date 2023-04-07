const express = require('express');
const passport = require('passport');
const session = require('express-session');
const passportUsekeyp = require('passport-oauth2').Strategy;
const path = require('path')
const app = express();

app.use(session({
  secret: 'YOUR_SECRET_KEY',
  resave: true,
  saveUninitialized: true
}));

passport.use(new passportUsekeyp({
    clientID: 'YOUR CLIENT ID',
    clientSecret: 'YOUR CLIENT SECRET',
    callbackURL: 'http://localhost:3000/auth/usekeyp/callback',
    authorizationURL: 'https://api.usekeyp.com/oauth/authorize',
    tokenURL: 'https://api.usekeyp.com/oauth/token',
    scope: ['openid'],
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log(profile);
    return cb(null, profile);
  }
));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

// serve a login page for starting the oauth flow using express.static
app.use(express.static(path.join(__dirname, 'public')));

app.get('/auth/usekeyp', passport.authenticate('usekeyp'));

app.get('/auth/usekeyp/callback',
  passport.authenticate('usekeyp', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect to success page.
    res.redirect('/success');
  });

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
