require('dotenv').config();
const express = require('express');
const router = express.Router();

const config = require('knex_config');
const knex = require('knex')(config);

const listUsers = () =>
  knex('users')
    .orderBy('id', 'desc')
    .then((rows) => rows)
    .catch((err) => err);

router.get('/', ({ params }, res) =>
  listUsers()
    .then((result) => res.jsonp({ result }))
    .catch((err) => {
      console.log('err: ', err);
      res.jsonp({ err })
    }),
);

module.exports = router;
