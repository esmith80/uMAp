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
app.use(bodyParser.json());
app.use(
  cookieSession({
    name: 'session',
    keys: ['key1', 'key2'],
  })
);
app.use(
  '/styles',
  sass({
    src: __dirname + '/styles',
    dest: __dirname + '/public/styles',
    debug: true,
    outputStyle: 'expanded',
  })
);
app.use(express.static('public'));

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

<<<<<<< HEAD
// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).
// app.get("/", (req, res) => {
//   res.render("index");
// });
=======
app.get('/', (req, res) => {
  res.json({ msg: 'Main page' });
});
// logout route
app.get('/logout', (req, res) => {
  req.session.user = '';
  res.redirect('/');
});
>>>>>>> 35e831ea872983a7e83d9f7a9c8f5ca7b49b0518

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
