/* Module that configures passport for both read- and
write-access login, and then exports its instance. */

const passport = require('passport');
const config = require('../../config');
const OAuth2Strategy = require('passport-oauth2');
const request = require('request-promise');

const User = require('../services/service-database').User;

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  /* If additional details about user account are needed
  attached to the session, incorporate database call
  here. Currently, EVE SSO server gives us all the info
  we need. */
  return done(null, user);
});

passport.use('oauth2-read', new OAuth2Strategy({
    authorizationURL: config.AUTH_URL,
    tokenURL: config.TOKEN_URL,
    clientID: config.READ_AUTH_CLIENT_ID,
    clientSecret: config.READ_AUTH_CLIENT_SECRET,
    callbackURL: config.READ_AUTH_CALLBACK_URL
  },
  (accessToken, refreshToken, profile, cb) => {
    request({
        method: 'GET',
        url: config.AUTH_VERIFY_URL,
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
        json: true})
      .then(character => {
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
              apiAccess: false
            };
            if (foundUser) {
              foundUser.update(userProps,
                {fields: ['accessToken', 'accessExpires', 'refreshToken']})
            } else {
              User.create(userProps)
            }
          });
        return cb(null, {character})
      })
      .catch(err => {return cb(err)});
  }
));

passport.use('oauth2-write', new OAuth2Strategy({
    authorizationURL: config.AUTH_URL,
    tokenURL: config.TOKEN_URL,
    clientID: config.WRITE_AUTH_CLIENT_ID,
    clientSecret: config.WRITE_AUTH_CLIENT_SECRET,
    callbackURL: config.WRITE_AUTH_CALLBACK_URL,
    scope: config.WRITE_AUTH_SCOPES
  },
  (accessToken, refreshToken, profile, cb) => {
    request({
        method: 'GET',
        url: config.AUTH_VERIFY_URL,
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
        json: true})
      .then(character => {
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
              apiAccess: true
            };
            if (foundUser) {
              foundUser.update(userProps,
                {fields: ['accessToken', 'accessExpires', 'refreshToken', 'apiAccess']})
            } else {
              User.create(userProps)
            }
          });
        return cb(null, {character})
      })
      .catch(err => {return cb(err)});
  }
));

module.exports = passport;