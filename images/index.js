const express = require('express');
const router = express.Router();

const config = require('knex_config');
const knex = require('knex')(config);

const bodyParser = require('body-parser');
router.use(bodyParser.json());

const ImagesController = require('controllers/ImagesController');

router.get('/', ({ params }, res) =>
  ImagesController.listAll()
    .then((result) => res.jsonp(result))
    .catch((err) => {
      console.log('err: ', err);
      res.jsonp({ err });
    }),
);


router.post('/', ({ body }, res) => {
  ImagesController.insertRecord(body)
    .then((result) => res.jsonp({success: result.length > 0, data: result }))
    .catch((err) => {
      console.log('err: ', err);
      res.jsonp({ err: err.toString(), success: false });
    });
});


module.exports = router;