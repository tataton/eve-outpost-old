# EVE Outpost

EVE Outpost is a market and manufacturing manager for [EVE Online](https://www.eveonline.com/). It is aimed at helping EVE industrialists serve small, remote markets.

The app has a server side that routes third-party SSO user authentication, aggregates market data from CCP's game server APIs, and maintains user and data databases. It also serves the client-side web app interface. The app is built to be deployed to [Heroku](https://www.heroku.com).

## Client-Side Technologies
* React.js
* React Router (DOM)
* Semantic-UI

## Server-Side Technologies
* Node.js
* Express
* Passport (session/cookie mgmt, OAuth2)
* Sequelize (PostgreSQL)


## UP & RUNNING
Install dependencies:
```
$ npm install
```
_or_
```
$ yarn
```

You can start a client-side development server:
```
$ yarn dev
```
but the client-side app will fail to get authentication data on its own. In order to run both the native server and enable auth, run the production server locally:
```
$ yarn start
```
Once the server is running, you can visit `http://localhost:8080/`

## Linting
_This assumes you have eslint and eslint-watch installed. If you don't, run the following:_
```
$ npm i -g eslint eslint-watch
```
or if you need permissions:
```
$ sudo npm i -g eslint eslint-watch
```

To run the linter once:
```
$ yarn lint
```

To run the watch task:
```
$ yarn lint:watch
```

## DEPLOYING TO HEROKU

_This assumes you have already have a Heroku account and have the [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli) installed_
```
$ heroku login
$ heroku create -a name-of-your-app
$ git push heroku master
$ heroku open
```

Heroku will follow the `build` command in your `package.json` and compile assets with `webpack.prod.config.js`. It runs the Express web server in `server.js`.