const Hashids = require('hashids');
var hashids = new Hashids(global.salt, 16);

const knexfile = require('knex_config');
const knex = require('knex')(knexfile);

const listAll = () => {
  // console.log(data)
  const { name, directions_id, chef_id, recipe_id, ...rest } = data;
  return (
    knex('directions')
      .where({ chef_id })
      // .where({name})
      // .orWhere({directions_id})
      .then((rows) => rows)
      .catch((err) => err)
  );
};

const insertRecord = (arrData) =>
  knex('directions')
    .insert(arrData)
    .onConflict('id', 'recipe_id', 'chef_id')
    .merge()
    .catch((err) => {
      console.log({ err });
      return err;
    });

const updateRecord = ({ id, directions_id, ...rest }) =>
  knex('directions')
    .where({ directions_id })
    .update(rest)
    .then((succ) => succ)
    .catch((err) => err);

const selectRecord = (query) =>
  knex('directions')
    .select()
    .where(query)
    .then((succ) => succ)
    .catch((err) => err);

const selectSample = (query) =>
  knex('directions')
    .select('directions.id', 'directions.text', 'directions.num')
    .where(query)
    .then((succ) => succ)
    .catch((err) => err);

module.exports = {
  listAll,
  insertRecord,
  selectRecord,
  updateRecord,
  selectSample,
};
