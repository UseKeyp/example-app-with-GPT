const express = require('express');
const passport = require('passport');
const session = require('express-session');
const OAuth2Strategy = require('passport-oauth2').Strategy;
const path = require('path')
const app = express();
const ejs = require('ejs');

app.use(session({
  secret: 'YOUR_SECRET_KEY',
  resave: true,
  saveUninitialized: true
}));

passport.use(new OAuth2Strategy({
    clientID: '36ec5460-affe-4f53-8740-48765e0e5797',
    callbackURL: 'http://localhost:3000/auth/usekeyp/callback',
    authorizationURL: 'https://app.usekeyp.com/oauth/auth',
    tokenURL: 'https://api.usekeyp.com/oauth/token',
    scope: ['openid email'],
    grant_type: 'authorization_code',
    pkce: true,
    state: true
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
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.get('/success', (req, res) => {
  res.render('success');
});
app.get('/', (req, res) => {
  res.render('index', {
    sessionData: req.session
  });
});

app.get('/auth/usekeyp', passport.authenticate('oauth2'));

app.get('/auth/usekeyp/callback',
  passport.authenticate('oauth2', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect to success page.
    res.redirect('/success');
  });

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
