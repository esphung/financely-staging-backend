require('dotenv').config();
const express = require('express');
const router = express.Router();

const config = require('knex_config');
const knex = require('knex')(config);

const bodyParser = require('body-parser');
router.use(bodyParser.json())

const listUsers = () =>
  knex('users')
    .orderBy('id', 'desc')
    .then((rows) => rows)
    .catch((err) => err);

router.post('/', (req, res) => {
  console.log('req.body: ', req.body);
  listUsers()
    .then((result) => res.jsonp(req.body))
    .catch((err) => {
      console.log('err: ', err);
      res.jsonp({ err });
    });
});

router.get('/', ({ params }, res) => {
  res.jsonp({ ...body });
  // return;
  listUsers()
    .then((result) => res.jsonp({ params }))
    .catch((err) => {
      console.log('err: ', err);
      res.jsonp({ err });
    });
});

module.exports = router;
