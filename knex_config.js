let config = {
  client: 'mysql',
  connection: {
    host: process.env.RDS_HOSTNAME, // 127.0.0.1 <= local
    port: process.env.RDS_PORT,
    user: process.env.RDS_USERNAME, // <= root
    password: process.env.RDS_PASSWORD, // <= password
    database: process.env.RDS_DB_NAME, // <= mydb
  },
  useNullAsDefault: true,
  multipleStatements: true,
};

module.exports = config;
