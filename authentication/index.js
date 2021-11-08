const Hashids = require('hashids');
const hashids = new Hashids(global.salt, 16);

require('dotenv').config();
const express = require('express');
const router = express.Router();

const config = require('knex_config');
const knex = require('knex')(config);

const bodyParser = require('body-parser');
router.use(bodyParser.json());

const UsersController = require('controllers/UsersController');

const randomMath = () => Math.random().toString(36).substr(2); // remove `0.`
const generateToken = () => randomMath() + randomMath(); //

async function login(credentials) {
  const isValidUser = (user) => {
    return (
      user?.password === credentials?.password &&
      user?.username?.toLowerCase() === credentials?.username?.toLowerCase()
    );
  };

  let temp = {
    success: false,
    data: { token: null },
    message: null,
  };
  let user = await UsersController.selectRecord({ username: credentials?.username });
  console.log('user: ', user);
  if (user) {
    if (isValidUser(user)) {
      // returning, verified user
      let token = generateToken();

      let result = await UsersController.updateRecord({ ...user, token })
        .then((succ) => ({
          ...temp,
          message: 'Welcome, back!',
          success: !!succ,
          data: { token, key: user?.chef_id },
        }))
        .catch((err) => {
          temp = { ...temp, err };
          return temp;
        });
      temp = { ...temp, ...result };
    } else {
      temp = { ...temp, message: 'Credentials invalid' };
    }
  } else {
    temp = { ...temp, message: 'User not found' };
  }
  return temp;
}

async function signup(data) {
  let chef_id = hashids.encode(String(Date.now()));
  let temp = { success: false };
  let params = { ...data, chef_id };
  let result = await UsersController.insertRecord(params);
  // console.log({ result });
  let success = result.length > 0 && !result.err;
  temp = {
    ...temp,
    message: `Signup ${success ? 'successful' : 'failed'}`,
    success,
    params,
  };
  return temp;
}

router.post('/login', ({ body }, res) =>
  login(body)
    .then((result) => res.status(200).jsonp(result))
    .catch((err) => {
      console.log('err: ', err);
      res.status(500).jsonp({ success: false, err, message: 'We cannot log you in' });
    }),
);

router.post('/signup', ({ body }, res) => {
  signup(body)
    .then((result) => res.status(200).jsonp(result))
    .catch((err) => {
      console.log('err: ', err);
      res.status(500).jsonp({ success: false, err, message: 'We cannot sign you up' });
    });
});

module.exports = router;
