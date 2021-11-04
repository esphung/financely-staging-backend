const express = require('express');
const server = express();
const morgan = require('morgan');

('use strict');

const { networkInterfaces } = require('os');

// routes
const users = require('users');

server.use(morgan('dev'));

server.use('/users', users);

server.get('/', (req, res) => res.send('OK'));

server.get('/ip', (req, res) => {
	const nets = networkInterfaces();
	const results = Object.create(null); // Or just '{}', an empty object

	for (const name of Object.keys(nets)) {
		for (const net of nets[name]) {
			// Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
			if (net.family === 'IPv4' && !net.internal) {
				if (!results[name]) {
					results[name] = [];
				}
				results[name].push(net.address);
			}
		}
	}
	console.log('results: ', results);
	res.jsonp({ ip_addresses: results });
});

module.exports = server;
