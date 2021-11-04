require('dotenv').config();

let config = {
  client: 'mysql',
  connection: {
    host: process.env.DB_HOST, // 127.0.0.1 <= local
    port: 3306,
    user: process.env.DB_USERNAME, // <= root
    password: process.env.DB_PASSWORD, // <= password
    database: process.env.DB_DATABASE, // <= mydb
  },
  useNullAsDefault: true,
}
const knex = require('knex')(config);

const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
router.use(bodyParser.json());

const listTable = (table) => {
  return knex('users')
    .orderBy('id', 'desc')
    .then((rows) => rows)
    .catch((err) => err);
}

router.get('/all', ({ params }, res) =>
  listTable(params?.table).then((result) => res.jsonp(result)),
);

router.get('/', (req, res) => res.send('OK'));

module.exports = router;
