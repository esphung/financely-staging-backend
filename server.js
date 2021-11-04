const express = require('express');
const server = express();
const morgan = require('morgan');

// routes
// const public = require('public');

server.use(morgan('dev'));
// server.use('/', public);

server.get('/', (req, res) => res.send('OK'))

module.exports = server;
