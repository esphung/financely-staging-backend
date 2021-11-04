require('dotenv').config();

const db_config = require('db_config');
// console.log('db_config: ', db_config);

module.exports = {
  client: 'mysql',
  connection: db_config,
  useNullAsDefault: true,
};
