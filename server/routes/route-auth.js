/* Handles authentication requests for login, logout,
and identification, to endpoint '/auth..'. */

const express = require('express');
const router = express.Router();
const passport = require('../modules/module-passport');

router.get('/read/login', passport.authenticate('oauth2-read'));
router.get('/write/login', passport.authenticate('oauth2-write'));

router.get('/read/callback', passport.authenticate('oauth2-read', {failureRedirect: '/'}), (req, res) => {
    // Will fill this in with params info to pass to React.
    // req.session.passport.user will now contain character info.
    res.redirect('/');
});

router.get('/write/callback', passport.authenticate('oauth2-write', {failureRedirect: '/'}), (req, res) => {
    // Will fill this in with params info to pass to React.
    // req.session.passport.user will now contain character info.
    res.redirect('/');
});

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

module.exports = router;