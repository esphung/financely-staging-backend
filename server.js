const express = require('express');
const server = express();
const morgan = require('morgan');
var cors = require('cors');

// middleware
server.use(cors())

// routes
const users = require('users');

server.use(morgan('dev'));
server.use('/users', users);

module.exports = server;
