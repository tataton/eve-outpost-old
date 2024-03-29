/* Module that configures passport for both read- and
write-access login, and then exports its instance. */

const passport = require('passport');
const config = require('../../config');
const OAuth2Strategy = require('passport-oauth2');
const request = require('request-promise');
const FQDN = process.env.FQDN || config.FQDN;
const AUTH_URL = 'https://login.eveonline.com/oauth/authorize';
const TOKEN_URL = 'https://login.eveonline.com/oauth/token';
const READ_AUTH_CLIENT_ID = process.env.READ_AUTH_CLIENT_ID || config.READ_AUTH_CLIENT_ID;
const READ_AUTH_CLIENT_SECRET = process.env.READ_AUTH_CLIENT_SECRET || config.READ_AUTH_CLIENT_SECRET;
const READ_AUTH_CALLBACK_URL = `http://${FQDN}/auth/read/callback`;
const WRITE_AUTH_CLIENT_ID = process.env.WRITE_AUTH_CLIENT_ID || config.WRITE_AUTH_CLIENT_ID;
const WRITE_AUTH_CLIENT_SECRET = process.env.WRITE_AUTH_CLIENT_SECRET || config.WRITE_AUTH_CLIENT_SECRET;
const WRITE_AUTH_CALLBACK_URL = 'http://${FQDN}/auth/write/callback';
const WRITE_AUTH_SCOPES = ['esi-assets.read_assets.v1', 'esi-markets.read_character_orders.v1'];
const AUTH_VERIFY_URL = 'https://login.eveonline.com/oauth/verify';

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
    authorizationURL: AUTH_URL,
    tokenURL: TOKEN_URL,
    clientID: READ_AUTH_CLIENT_ID,
    clientSecret: READ_AUTH_CLIENT_SECRET,
    callbackURL: READ_AUTH_CALLBACK_URL
  },
  (accessToken, refreshToken, profile, cb) => {
    request({
        method: 'GET',
        url: AUTH_VERIFY_URL,
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
    authorizationURL: AUTH_URL,
    tokenURL: TOKEN_URL,
    clientID: WRITE_AUTH_CLIENT_ID,
    clientSecret: WRITE_AUTH_CLIENT_SECRET,
    callbackURL: WRITE_AUTH_CALLBACK_URL,
    scope: WRITE_AUTH_SCOPES
  },
  (accessToken, refreshToken, profile, cb) => {
    request({
        method: 'GET',
        url: AUTH_VERIFY_URL,
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