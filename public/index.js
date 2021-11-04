const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

router.use(bodyParser.json());

const knex = require('knex')({
  client: 'mysql',
  connection: {
    host: process.env.DB_HOST, // 127.0.0.1 <= local
    port: process.env.DB_PORT,
    user: process.env.DB_USERNAME, // <= root
    password: process.env.DB_PASSWORD, // <= password
    database: process.env.DB_DATABASE, // <= mydb
  },
});

const listTable = (table) =>
  knex(table)
    .orderBy('id', 'desc')
    .then((rows) => rows)
    .catch((err) => err);

router.get('/:table', ({ params }, res) =>
  listTable(params?.table).then((result) => res.jsonp(result)),
);

router.get('/', (req, res) => res.send('OK'));

module.exports = router;
