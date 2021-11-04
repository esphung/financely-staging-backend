/**
|--------------------------------------------------
| db
|--------------------------------------------------
*/
require('dotenv').config();

let db_config = {
	host: process.env.DATABASE_HOST,
	user: process.env.DATABASE_USER,
	password: process.env.DATABASE_PASSWORD,
	database: process.env.DATABASE_NAME,
	port: process.env.DATABASE_PORT,
	charset : 'utf8mb4', // for emojis
	multipleStatements: true,
};

console.log('db_config: ', db_config);

module.exports = db_config;
