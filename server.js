const express = require('express');
const server = express();
const morgan = require('morgan');

// routes
const users = require('users');

server.use(morgan('dev'));

server.use('/users', users);

// server.get('/', (req, res) => res.send('OK'));

require('dotenv').config();

var mysql = require('mysql');

var connection = mysql.createConnection({
	host: process.env.RDS_HOSTNAME,
	user: process.env.RDS_USERNAME,
	password: process.env.RDS_PASSWORD,
	port: process.env.RDS_PORT,
});

connection.connect(function (err) {
	if (err) {
		console.error('Database connection failed: ' + err.stack);
		return;
	}
	console.log('Connected to database.');
});

connection.end();

server.get('/', (req, res) => res.status(200).send('OK'));

module.exports = server;
