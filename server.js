const path = require('path');
const express = require('express');
const app = express();
const passport = require('passport');
const session = require('express-session');

const config = require('./config');
const PORT = process.env.PORT || config.PORT;
const SESSION_SECRET = process.env.SESSION_SECRET || config.SESSION_SECRET;

app.use(session({secret: SESSION_SECRET}));
app.use(passport.initialize());
app.use(passport.session());

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

app.listen(PORT, error => (
  error
    ? console.error(error)
    : console.info(`Listening on port ${PORT}. Visit http://localhost:${PORT}/ in your browser.`)
));
