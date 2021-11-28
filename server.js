const express = require('express');
const server = express();
const morgan = require('morgan');

// const ImagesController = require('controllers/ImagesController')
// console.log('ImagesController: ', ImagesController);

// routes
const users = require('users');
const authentication = require('authentication');
const recipes = require('recipes');
const images = require('images');

server.use(morgan('dev'));

server.use('/users', users);
server.use('/authentication', authentication);
server.use('/recipes', recipes);
server.use('/images', images);

// stored images to display publicly
server.use(express.static('public'))

// server.get('/', (req, res) => res.send('OK'));

require('dotenv').config();

server.get('/', (req, res) => res.status(200).send('OK'));

module.exports = server;
