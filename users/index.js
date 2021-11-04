require('dotenv').config();

let config = {
  client: 'mysql',
  connection: {
    host: process.env.DB_HOST, // 127.0.0.1 <= local
    port: process.env.DB_PORT,
    user: process.env.DB_USERNAME, // <= root
    password: process.env.DB_PASSWORD, // <= password
    database: process.env.DB_DATABASE, // <= mydb
  },
  useNullAsDefault: true,
};
const knex = require('knex')(config);

const express = require('express');
const router = express.Router();

const listTable = () =>
  knex('users')
    .orderBy('id', 'desc')
    .then((rows) => rows)
    .catch((err) => err);

router.get('/all', ({ params }, res) =>
  listTable()
    .then((result) => res.jsonp({ result }))
    .catch((err) => res.jsonp({ err })),
);

router.get('/', (req, res) => {
  var ip = req?.headers?.['x-forwarded-for'] ||
     req?.socket?.remoteAddress ||
     null;

  res.jsonp({
    ip, // : req?.socket?.remoteAddress
  });
});

module.exports = router;
