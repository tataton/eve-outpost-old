const path = require('path');
const express = require('express');
const helmet = require('helmet');
const app = express();
const passport = require('passport');
const session = require('express-session');
const config = require('./config');
const sessionStore = require('./server/services/service-database').SessionStore;
const PORT = process.env.PORT || config.PORT;
const SESSION_SECRET = process.env.SESSION_SECRET || config.SESSION_SECRET;
const COOKIE_NAME = process.env.COOKIE_NAME || config.COOKIE_NAME;

const sessionObject = {
  secret: SESSION_SECRET,
  name: COOKIE_NAME,
  store: sessionStore,
  saveUninitialized: true,
  resave: false,
  cookie: {}
};

/* Need to figure out how to use this correctly:
if (app.get('env') === 'production') {
  app.set('trust proxy', 1) // trust first proxy
  sess.cookie.secure = true // serve secure cookies
}
*/

app.use(helmet());
app.use(session(sessionObject));
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
