const express = require('express');
const server = express();
const morgan = require('morgan');

// routes
const users = require('users');

server.use(morgan('dev'));

server.use('/users', users);

server.get('/', (req, res) => res.send('OK'))

module.exports = server;
