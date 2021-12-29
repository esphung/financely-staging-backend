const Hashids = require('hashids');
var hashids = new Hashids(global.salt, 16);

const knexfile = require('knex_config');
const knex = require('knex')(knexfile);

const getCount = ({chef_id}) =>
  knex
    .from('recipes')
    .modify((queryBuilder) => {
      if (chef_id) queryBuilder.where('recipes.chef_id', chef_id);
    })
    .count('id as count')
    .first()
    .then((result) => result)
    .catch((err) => {
      err;
    });

const listAllPaginated = ({ offset, limit, chef_id, visibility }) =>
  knex
    .from('recipes')
    .modify((queryBuilder) => {
      if (chef_id) queryBuilder.where('recipes.chef_id', chef_id);
      if (visibility) queryBuilder.where('recipes.visibility', visibility);
    })
    .leftJoin('users', 'users.chef_id', 'recipes.chef_id')
    .select(
      'users.username',
      'recipes.id',
      'recipes.name',
      'recipes.description',
      'recipes.created',
      'recipes.minutes',
      'recipes.recipe_id',
      'recipes.chef_id',
      'recipes.rating',
      'recipes.difficulty',
    )
    .limit(limit)
    .offset(offset)
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
      'recipes.id',
      'recipes.name',
      'recipes.description',
      'recipes.created',
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
  getCount,
  listAllPaginated,
  insertRecord,
  selectRecord,
  updateRecord,
  listAllBy,
  listSamplesBy,
};
