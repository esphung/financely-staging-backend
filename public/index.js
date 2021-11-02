const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

router.use(bodyParser.json());

router.get('/', (req, res) => {
  res.send('Hello World!');
});

router.post('/authenticate', (req, res) => {
  console.log('req.body: ', req.body);
  res.json({ success: true, data: { authenticated: true } });
});

router.post('/token', (req, res) => {
  const createToken = () => 'token_' + Math.random().toString(36).substr(2, 9);
  res.json({ success: true, data: { token: createToken() } });
});

module.exports = router;
