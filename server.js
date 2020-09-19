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

// Mount all resource routes
app.use('/api/login', loginRoute(db));
app.use('/api/map', mapRoute(db));
app.use('/api/pin', pinRoute(db));

// logout route
app.get('/logout', (req, res) => {
  req.session.user = '';
  res.redirect('/');
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
