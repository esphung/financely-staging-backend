const express = require('express');
const router = express.Router();

const config = require('knex_config');
const knex = require('knex')(config);

const UsersController = require('controllers/UsersController');

const bodyParser = require('body-parser');
router.use(bodyParser.json());

router.get('/', ({ params }, res) =>
  UsersController.listAll()
    .then((result) => res.jsonp({ result }))
    .catch((err) => {
      console.log('err: ', err);
      res.jsonp({ err });
    }),
);

router.get('/:token', ({ params }, res) =>
  UsersController.selectRecord(params)
    .then((result) => res.jsonp({ success: !!result.id, data: result }))
    .catch((err) => {
      console.log('err: ', err);
      res.jsonp({ err, success: false });
    }),
);

router.put('/:chef_id', ({ body, params }, res) =>
  UsersController.updateRecord(body)
    .then((result) => res.jsonp({ success: !!result, result }))
    .catch((err) => {
      console.log('err: ', err);
      res.jsonp({ err });
    }),
);

module.exports = router;
