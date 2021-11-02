const express = require('express');
const server = express();
const morgan = require('morgan');

// routes
const public = require('public');

server.use(morgan('dev'));
server.use('/', public);

module.exports = server;
