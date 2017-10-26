const path = require('path');
const express = require('express');
const app = express();
const config = require('./config');

/* Passport will be configured in separate module:
const passportmod = require('./server/auth/passport-module');
*/

/* Auth content, moving to a module */

const passport = require('passport');
const OAuth2Strategy = require('passport-oauth2');
const request = require('request');

app.use(passport.initialize());

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(new OAuth2Strategy({
    authorizationURL: config.AUTH_URL,
    tokenURL: config.TOKEN_URL,
    clientID: config.AUTH_CLIENT_ID,
    clientSecret: config.AUTH_CLIENT_SECRET,
    callbackURL: config.OUR_AUTH_CALLBACK_URL,
    passReqToCallback: true
  },
  (req, accessToken, refreshToken, profile, cb) => {
    request({
      method: 'GET',
      url: config.AUTH_VERIFY_URL,
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }, (err, res, body) => {
      if (err) return cb(err);

      return cb(null, {
        accessToken: accessToken,
        refreshToken: refreshToken,
        character: JSON.parse(body)
      });
    });
  }
));

app.use(express.static(path.join(__dirname, 'dist')));

app.get('/auth', passport.authenticate('oauth2'), (req, res) => {
});

app.get('/auth/callback', passport.authenticate('oauth2', {failureRedirect: '/'}), (req, res) => {
  // req.session.passport.user should contain your accessToken, refreshToken and character info
  console.log(req.session.passport.user);
  res.redirect('/');
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/dist/index.html');
});

app.listen(config.PORT, error => (
  error
    ? console.error(error)
    : console.info(`Listening on port ${config.PORT}. Visit http://localhost:${config.PORT}/ in your browser.`)
));
