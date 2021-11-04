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

const sql = require('mssql');

const sqlConfig = {
	user: process.env.RDS_USERNAME,
	password: process.env.RDS_PASSWORD,
	database: 'ebdb',
	server: 'aa93w2gyehkwsk.ct84h08hzrs8.us-east-2.rds.amazonaws.com',
	port: 3306,
	pool: {
		max: 10,
		min: 0,
		idleTimeoutMillis: 30000,
	},
	options: {
		encrypt: true, // for azure
		trustServerCertificate: false, // change to true for local dev / self-signed certs
	},
};

server.get('/', async (req, res) => {
	let result;
	const loadResource = async () => {
		try {
			// make sure that any items are correctly URL encoded in the connection string
			result = await sql.connect(sqlConfig);
			const result = await sql.query`select * from mytable where id = ${value}`;
			console.log({ result });

			res.jsonp({ result });
		} catch (err) {
			result = err;
			console.log('err: ', err);
			// ... error checks

			res.jsonp({ result });
		}
	};

	loadResource()

	
});

// var connection = mysql.createConnection({
// 	host: process.env.RDS_HOSTNAME,
// 	user: process.env.RDS_USERNAME,
// 	password: process.env.RDS_PASSWORD,
// 	port: process.env.RDS_PORT,
// });

// connection.connect(function (err) {
// 	if (err) {
// 		console.error('Database connection failed: ' + err.stack);
// 		return;
// 	}

// 	console.log('Connected to database.');
// });

// connection.end();

module.exports = server;

// const fs = require('fs')

// fs.readFile('/Users/joe/test.txt', 'utf8' , (err, data) => {
//   if (err) {
//     console.error(err)
//     return
//   }
//   console.log(data)
// })
