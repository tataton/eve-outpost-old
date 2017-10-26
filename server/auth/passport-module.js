/* Module for configuration of passport. */

const passport = require('passport');
const config = require('../../config');

/* Database queries contained in a service, for future
unit testing. */
const UserService = require('../services/user');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    // Needs to find or add new user
    UserService.findUserById(id, function (err, user) {
      if (err) {
        return done(err);
      }
  
      return done(null, user);
    });
});