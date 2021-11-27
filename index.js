const SALT = 'ALL YOU CAN EAT';
global.salt = SALT

require('app-module-path').addPath(__dirname);

require('dotenv').config();
// console.log('process.env.NODE_ENV: ', process.env.NODE_ENV);

const { RDS_HOSTNAME, RDS_PORT, RDS_DB_NAME, RDS_USERNAME, RDS_PASSWORD } =
	process.env;
// console.log({ RDS_HOSTNAME, RDS_PORT, RDS_DB_NAME, RDS_USERNAME, RDS_PASSWORD });

const server = require('./server');

const port = process.env.PORT || 8080;

server.listen(port, () => console.log(`App listening at http://localhost:${port}`));
