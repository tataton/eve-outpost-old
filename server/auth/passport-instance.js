/* Module that configures passport, and then exports
its instance. */

const passport = require('passport');
const config = require('../../config');
const OAuth2Strategy = require('passport-oauth2');
const request = require('request');

/* Database queries contained in a service, for future
unit testing. */
// const UserService = require('../services/user');

passport.serializeUser((user, done) => {
  console.log(user);
  done(null, user.character.CharacterID);
});

passport.deserializeUser((id, done) => {
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

module.exports = passport;