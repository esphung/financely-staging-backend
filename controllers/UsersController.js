const Hashids = require('hashids');
var hashids = new Hashids('ALL YOU CAN EAT', 16);

const knexfile = require('knex_config');
const knex = require('knex')(knexfile);

const listAll = () =>
  knex('users')
    .then((rows) => rows)
    .catch((err) => err);

const insertRecord = (params) => {
  // console.log({ params });
  return (
    knex('users')
      .insert(params)
      // .onConflict('username','chef_id')
      // .merge()
      .then((result) => result)
      .catch((err) => ({ err }))
  );
};

const updateRecord = ({ chef_id = null, ...rest }) => {
  return (
    knex('users')
      // .where({id})
      .where({ chef_id })
      .update({ ...rest })
      .then((succ) => succ)
      .catch((err) => err)
  );
};

const selectRecord = (query) =>
  knex('users')
    .select()
    .where(query)
    .first()
    .then((succ) => succ)
    .catch((err) => ({ err }));

module.exports = {
  listAll,
  insertRecord,
  selectRecord,
  updateRecord,
};
