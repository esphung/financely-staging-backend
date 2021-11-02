const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

router.use(bodyParser.json())

router.get('/', (req, res) => {
  res.send('Hello World!');
});

router.post('/authenticate', (req, res) => {
  console.log('req.body: ', req.body);
  res.json(req.body);
});

module.exports = router;
