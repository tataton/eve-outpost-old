/* Handles all authentication requests sent to '/auth..',
including login, logout, and client-side user
identification. */

const express = require('express');
const router = express.Router();
const passport = require('../modules/module-passport');

router.get('/', passport.authenticate('oauth2'));

router.get('/callback', passport.authenticate('oauth2', {failureRedirect: '/'}), (req, res) => {
    // req.session.passport.user now contains characterID.
    res.redirect('/');
});

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

module.exports = router;