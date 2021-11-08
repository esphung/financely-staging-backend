const Hashids = require('hashids');
var hashids = new Hashids(global.salt, 16);

const knexfile = require('knex_config');
const knex = require('knex')(knexfile);

const listAll = () => {
  // console.log(data)
  const { name, ingredients_id, chef_id, recipe_id, ...rest } = data;
  return (
    knex('ingredients')
      .where({ chef_id })
      // .where({name})
      // .orWhere({ingredients_id})
      .then((rows) => rows)
      .catch((err) => err)
  );
};

const insertRecord = (arrData) =>
  knex('ingredients')
    .insert(arrData)
    .onConflict('id', 'recipe_id', 'chef_id')
    .merge()
    .catch((err) => {
      console.log({ err });
      return err;
    });

const updateRecord = ({ id, ingredients_id, ...rest }) =>
  knex('ingredients')
    .where({ ingredients_id })
    .update(rest)
    .then((succ) => succ)
    .catch((err) => err);

const selectRecord = (query) =>
  knex('ingredients')
    .select()
    .where(query)
    .then((succ) => succ)
    .catch((err) => err);

const selectSample = (query) =>
  knex('ingredients')
    .select('ingredients.name','ingredients.unit','ingredients.count')
    .where(query)
    .then((succ) => succ)
    .catch((err) => err);

module.exports = {
  listAll,
  insertRecord,
  selectRecord,
  updateRecord,
  selectSample
};
