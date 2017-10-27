/* Handles all authentication requests sent to '/auth..',
including login, logout, and client-side user
identification. */

const express = require('express');
const router = express.Router();
const passport = require('../auth/passport-instance');

router.get('/', passport.authenticate('oauth2'));

router.get('/callback', passport.authenticate('oauth2', {failureRedirect: '/'}), (req, res) => {
    // req.session.passport.user now contains accessToken, refreshToken and character info;
    // this info needs to be saved to database
    res.redirect('/');
});

module.exports = router;