const path = require('path');
const express = require('express');
const app = express();
const config = require('./config');

const passport = require('passport');

app.use(passport.initialize());

/** ---------- ROUTES ---------- **/
const auth = require('./server/routes/route-auth');
app.use('/auth', auth);

app.use(express.static(path.join(__dirname, 'dist')));

/* May need to add query flag to below, in order to allow query
routes to reach React Router and not get caught by '*'. */
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
