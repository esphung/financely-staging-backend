const express = require('express');
const server = express();
const morgan = require('morgan');

// routes
const users = require('users');
const authentication = require('authentication');
const recipes = require('recipes');

server.use(morgan('dev'));

server.use('/users', users);
server.use('/authentication', authentication);
server.use('/recipes', recipes);

// server.get('/', (req, res) => res.send('OK'));

require('dotenv').config();

server.get('/', (req, res) => res.status(200).send('OK'));

module.exports = server;
