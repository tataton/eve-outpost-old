/* Module that configures passport, and then exports
its instance. */

const passport = require('passport');
const config = require('../../config');
const OAuth2Strategy = require('passport-oauth2');
const request = require('request');

const User = require('../services/service-database').User;

passport.serializeUser((user, done) => {
  console.log(user);
  done(null, user);
});

passport.deserializeUser((user, done) => {
  /* If additional details about user account are needed
  attached to the session, incorporate database call
  here. Currently, EVE SSO server gives us all the info
  we need. */
  return done(null, user);
});

passport.use(new OAuth2Strategy({
    authorizationURL: config.AUTH_URL,
    tokenURL: config.TOKEN_URL,
    clientID: config.AUTH_CLIENT_ID,
    clientSecret: config.AUTH_CLIENT_SECRET,
    callbackURL: config.OUR_AUTH_CALLBACK_URL
  },
  (accessToken, refreshToken, profile, cb) => {
    request({
        method: 'GET',
        url: config.AUTH_VERIFY_URL,
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }, (err, res, body) => {
        if (err) return cb(err);
        const character = JSON.parse(body);
        // Update (if already registered) or save character user profile.
        User
          .findOne({where: {characterID: character.CharacterID}})
          .then(foundUser => {
            const userProps = {
              accessToken, 
              accessExpires: character.ExpiresOn, 
              refreshToken,
              characterID: character.CharacterID,
              characterName: character.CharacterName,
              characterOwnerHash: character.CharacterOwnerHash,
              accountType: 'market'
            };
            if (foundUser) {
              foundUser.update(userProps, {fields: ['accessToken', 'accessExpires', 'refreshToken']})
            } else {
              User.create(userProps)
            }
          });
        return cb(null, {character});
      }
    );
  }
));

module.exports = passport;