const path = require('path');
const express = require('express');
const app = express();
const config = require('./config');

const passport = require('passport');

app.use(passport.initialize());

/** ---------- ROUTES ---------- **/
const authRead = require('./server/routes/route-auth-readonly');
app.use('/auth/read', authRead);

app.use(express.static(path.join(__dirname, 'dist')));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/dist/index.html');
});

app.get('*', (req, res) => {
  res.redirect('/');
});

app.listen(config.PORT, error => (
  error
    ? console.error(error)
    : console.info(`Listening on port ${config.PORT}. Visit http://localhost:${config.PORT}/ in your browser.`)
));
