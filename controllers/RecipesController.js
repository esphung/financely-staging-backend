const Hashids = require('hashids');
var hashids = new Hashids(global.salt, 16);

const knexfile = require('knex_config');
const knex = require('knex')(knexfile);

const listAll = () =>
  knex
    .from('recipes')
    .orderBy('id', 'desc')
    .then((rows) => rows)
    .catch((err) => {
      err;
    });

const listAllBy = (params) =>
  knex('recipes')
    .where({ ...params, voided: 0 })
    .orderBy('id', 'desc')
    .then((rows) => rows)
    .catch((err) => ({ err }));

const insertRecord = (params) =>
  knex('recipes')
    .insert({
      ...params,
    })
    .onConflict('id', 'recipe_id')
    .ignore()
    .then((succ) => succ)
    .catch((err) => {
      err;
    });

const updateRecord = ({ id, recipe_id, ...rest }) =>
  knex('recipes')
    .where({ recipe_id })
    .update(rest)
    .then((succ) => succ)
    .catch((err) => {
      err;
    });

const selectRecord = (query) =>
  knex('recipes')
    .select()
    .where(query)
    .first()
    .then((succ) => succ)
    .catch((err) => ({ err }));

const listSamplesBy = (params) =>
  knex('recipes')
    .select(
      'recipes.name',
      'recipes.description',
      'recipes.minutes',
      'recipes.recipe_id',
      'recipes.rating',
      'recipes.difficulty',
    )
    .where({ ...params, voided: 0 })
    .orderBy('id', 'desc')
    .then((rows) => rows)
    .catch((err) => ({ err }));

module.exports = {
  listAll,
  insertRecord,
  selectRecord,
  updateRecord,
  listAllBy,
  listSamplesBy,
};
