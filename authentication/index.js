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
const generateToken = () => randomMath() + randomMath(); // "bnh5yzdirjinqaorq0ox1tf383nb3xr"

async function authenticateLogin(credentials) {
  let temp = {
    success: false,
    data: { token: null },
    message: 'We could not authenticate you',
  };

  let user = await UsersController.selectRecord(credentials);

  let token = !!user?.verified ? generateToken() : null;
  if (!user.verified) temp = { ...temp, message: "You aren't verified yet." };
  console.log({ user, token, credentials });
  if (user && token) {
    temp = await UsersController.updateRecord({ ...user, token }).then((succ) => ({
      ...temp,
      message: 'You were authenticated!',
      success: !!token && !!succ,
      data: { token },
    }));
  }
  return temp;
}

async function exchangeTokenForAcct({ token }) {
  let temp = { success: false, data: null };
  let user = await UsersController.selectRecord({ token });
  return { success: !!user, data: user };
}
async function signOutSession(data) {
  let temp = { success: false };
  // check if user logged in already
  let { token: foundToken, chef_id: foundChefId } =
    await UsersController.selectRecord(data);
  console.log({ foundToken, foundChefId });

  if (foundChefId === data.chef_id && !!foundToken) {
    // unset account token
    let token = null;
    let result = await UsersController.updateRecord({ ...data, token });
    temp = { ...temp, success: !!result };
  }
  return temp;
}

async function registerNewUser(data) {
  let chef_id = hashids.encode(String(Date.now()));
  let temp = { success: false };
  let params = { ...data, chef_id };
  let resp = await UsersController.insertRecord(params);

  console.log({ resp });
  temp = { ...temp, success: resp.length > 0 && !resp.err };

  return temp;
}

let testData = {
  username: 'test9876@chef.com',
  password: 'password',
};
async function main() {
  let signup = await registerNewUser(testData);
  console.log({ signup });
  return;

  // LOGIN WITH EMAIL + PASSWORD
  let signin = await authenticateLogin({
    username: 'username',
    password: 'password',
  });
  const {
    message,
    success,
    data: { token },
  } = signin;
  if (!success) return;

  // GET USER INFO WITH TOKEN
  let { data: user } = await exchangeTokenForAcct({ token });
  console.log({ user });

  let meal = await storeMeal({ ...test_recipe, chef_id: user.chef_id });
  console.log({ meal });

  // SIGNOUT AND REMOVE TOKEN
  let signout = await signOutSession({
    token: userData.token,
    chef_id: userData.chef_id,
  });
  console.log({ signout });
}

const listUsers = () =>
  knex('users')
    .orderBy('id', 'desc')
    .then((rows) => rows)
    .catch((err) => err);

router.post('/', (req, res) => {
  console.log('req.body: ', req.body);
  authenticateLogin(req.body)
    .then((result) => res.jsonp({ ...result }))
    .catch((err) => {
      console.log('err: ', err);
      res.jsonp({ success: false, message: 'We cannot log you in' });
    });
});

// router.get('/', ({ params }, res) => {
//   res.jsonp({ ...body });
//   // return;
//   listUsers()
//     .then((result) => res.jsonp({ params }))
//     .catch((err) => {
//       console.log('err: ', err);
//       res.jsonp({ success: false, err });
//     });
// });

module.exports = router;
