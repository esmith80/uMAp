// load .env data into process.env
require('dotenv').config();

// Web server config
const PORT = process.env.PORT || 8080;
const ENV = process.env.ENV || 'development';
const express = require('express');
const bodyParser = require('body-parser');
const sass = require('node-sass-middleware');
const app = express();
const morgan = require('morgan');
const cookieSession = require('cookie-session');

// PG database client/connection setup
const { Pool } = require('pg');
const dbParams = require('./lib/db.js');
const db = new Pool(dbParams);
db.connect();

// Middleware
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cookieSession({
    name: 'session',
    keys: ['key1', 'key2'],
  })
);
app.use((req, res, next) => {
  if (!req.session.user) {
    req.session.user = {
      userId: 'hello',
      username: 'noname',
    };
  }
  next();
});
app.use(
  '/styles',
  sass({
    src: __dirname + '/styles',
    dest: __dirname + '/public/styles',
    debug: true,
    outputStyle: 'expanded',
  })
);
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
// Separated Routes for each Resource
const loginRoute = require('./routes/login.route');
const mapRoute = require('./routes/map.route');
const pinRoute = require('./routes/pin.route');
const mapReviewsRoute = require('./routes/map.reviews.route');

// Mount all resource routes
app.use('/api/login', loginRoute(db));
app.use('/api/map', mapRoute(db));
app.use('/api/pin', pinRoute(db));
app.use('/api/comment', mapReviewsRoute(db));

// app.get('/', (req, res) => {
//   const { userId, username, useremail } = req.session.user;
//   if (userId === 'hello') {
//     res.redirect('/api/login');
//   }
//   res.render('index', { userId, username, useremail });
// });
// logout route
app.get('/logout', (req, res) => {
  req.session.user = '';
  res.redirect('/api/login');
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
