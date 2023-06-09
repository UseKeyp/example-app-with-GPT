const express = require('express');
const passport = require('passport');
const session = require('express-session');
const OAuth2Strategy = require('passport-oauth2').Strategy;
const path = require('path')
const app = express();
const ejs = require('ejs');
const jwksClient = require('jwks-rsa');
const jwt = require('jsonwebtoken');
const axios = require('axios');

app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: 'YOUR_SECRET_KEY',
  resave: true,
  saveUninitialized: true
}));

const callbackURL = process.env.callbackURL || 'http://localhost:3000/auth/usekeyp/callback'

passport.use(new OAuth2Strategy({
  clientID: '36ec5460-affe-4f53-8740-48765e0e5797',
  callbackURL,
  authorizationURL: 'https://app.usekeyp.com/oauth/auth',
  tokenURL: 'https://api.usekeyp.com/oauth/token',
  scope: ['openid email'],
  grant_type: 'authorization_code',
  pkce: true,
  state: true,
  getUserInfo: true
},
  (accessToken, refreshToken, profile, extra, cb) => {
    let { header, payload } = jwt.decode(profile.id_token, { complete: true })
    return cb(null, { ...profile, ...payload });
  }
));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

// serve a login page for starting the oauth flow using express.static
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.get('/success', (req, res) => {
  res.render('success');
});
app.get('/', (req, res) => {
  console.log(req.session)
  let user
  if (req.session.passport && req.session.passport.user) {
    user = req.session.passport.user;
  }
  res.render('index', {
    user,
    error: null
  });
});

app.get('/auth/usekeyp', passport.authenticate('oauth2'));

app.get('/auth/usekeyp/callback',
  passport.authenticate('oauth2', { failureRedirect: '/' }),
  function (req, res) {
    // Successful authentication, redirect to success page.
    res.redirect('/success');
  });

app.post('/tokens', (req, res) => {
  const { tokenAddress, tokenType, toUserUsername, toUserProviderType, amount } = req.body;

  const data = {
    toUserUsername,
    toUserProviderType,
    tokenAddress,
    tokenType,
    amount,
  }

  const ACCESS_TOKEN = req.session.passport.user.access_token

  const options = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ACCESS_TOKEN}`,
    },
  }

  axios
    .post('https://api.usekeyp.com/v1/tokens/transfers', data, options)
    .then((response) => {
      console.log(response.data);
      // res.send('Token transfer successful!');
      if (response.data.error) throw response.data.error
      res.redirect('transfer', {
        hash: response.data.hash
      });
    })
    .catch((error) => {
      console.error(error);
      let user
      if (req.session.passport && req.session.passport.user) {
        user = req.session.passport.user;
      }
      res.render('index', {
        user,
        error: `Token transfer failed. ${error}`
      });
    });
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
