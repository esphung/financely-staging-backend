const Hashids = require('hashids');
var hashids = new Hashids(global.salt, 16);

const knexfile = require('knex_config');
const knex = require('knex')(knexfile);

function searchQuery({ chef_id, name, limit, offset }) {
  // console.log({ chef_id });
  return (
    knex
      .from('recipes')
      // .select('recipes.name')
      // .modify((queryBuilder) => {
      //   if (limit) queryBuilder.limit(limit);
      // })
      .where({ voided: 0 })
      .where('recipes.chef_id', chef_id)
      .modify((queryBuilder) => {
        if (chef_id) queryBuilder.where('recipes.chef_id', chef_id);
      })
      .modify((queryBuilder) => {
        if (name) {
          queryBuilder.where('recipes.chef_id', '=', chef_id);

          queryBuilder.whereRaw("LOWER(REPLACE(recipes.name, ' ', '')) LIKE ?", [
            `%${name.toLowerCase().replace(/ /g, '')}%`,
          ]);
        }
      })
      // .modify((queryBuilder) => {
      //   if (chef_id) queryBuilder.where('recipes.chef_id', chef_id);
      //   else queryBuilder.where({ visibility: 'PUBLIC' });
      // })

      .leftJoin('users', 'users.chef_id', 'recipes.chef_id')
      .select(
        'users.username',
        'users.avatar',
        'recipes.id',
        'recipes.name',
        'recipes.description',
        'recipes.created',
        'recipes.minutes',
        'recipes.recipe_id',
        'recipes.chef_id',
        'recipes.rating',
        'recipes.difficulty',
        'recipes.visibility',
        'recipes.version',
      )
      .limit(limit || 10)
      .offset(offset || 0)
      .then((rows) => rows)
      .catch((err) => err)
  );
}

const getCount = ({ chef_id, name, ...params }) =>
  knex
    .from('recipes')
    .where(params)
    .modify((queryBuilder) => {
      if (name) {
        queryBuilder.where('recipes.chef_id', '=', chef_id);

        queryBuilder.whereRaw("LOWER(REPLACE(recipes.name, ' ', '')) LIKE ?", [
          `%${name.toLowerCase().replace(/ /g, '')}%`,
        ]);
      }
    })
    .modify((queryBuilder) => {
      if (chef_id) queryBuilder.where('recipes.chef_id', chef_id);
    })
    // .modify((queryBuilder) => {
    //   if (visibility) queryBuilder.where('recipes.visibility', visibility);
    // })
    .count('id as count')
    .first()
    .then((result) => result)
    .catch((err) => {
      return err;
    });

const listAllPaginated = ({ offset, limit, chef_id, visibility }) =>
  knex
    .from('recipes')
    .modify((queryBuilder) => {
      if (chef_id) queryBuilder.where('recipes.chef_id', chef_id);
    })
    .modify((queryBuilder) => {
      if (visibility) queryBuilder.where('recipes.visibility', visibility);
    })
    .where({ voided: 0 })
    .leftJoin('users', 'users.chef_id', 'recipes.chef_id')
    .select(
      'users.username',
      'users.avatar',
      'recipes.id',
      'recipes.name',
      'recipes.description',
      'recipes.created',
      'recipes.minutes',
      'recipes.recipe_id',
      'recipes.chef_id',
      'recipes.rating',
      'recipes.difficulty',
      'recipes.visibility',
      'recipes.version',
    )
    .limit(limit)
    .offset(offset)
    .orderBy('id', 'desc')
    .then((rows) => rows)
    .catch((err) => err);

const listAllForFeed = ({ offset, limit, chef_id, ...params }) =>
  knex('recipes')
    .where({ ...params, voided: 0 })
    .modify((queryBuilder) => {
      if (chef_id) queryBuilder.where('recipes.chef_id', chef_id);
    })
    // .modify((queryBuilder) => {
    //   if (visibility) queryBuilder.where('recipes.visibility', visibility);
    // })
    .where({ voided: 0, visibility: 'PUBLIC' })
    .leftJoin('users', 'users.chef_id', 'recipes.chef_id')
    .select(
      'users.username',
      'users.avatar',
      'recipes.id',
      'recipes.name',
      // 'recipes.description',
      'recipes.created',
      // 'recipes.minutes',
      'recipes.recipe_id',
      'recipes.chef_id',
      // 'recipes.rating',
      // 'recipes.difficulty',
      // 'recipes.visibility',
      'recipes.version',
    )
    .limit(limit)
    .offset(offset)
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

const updateRecord = ({
  id = null,
  images,
  ingredients,
  username,
  avatar,
  created,
  directions,
  recipe_id,
  version = 0,
  ...rest
}) =>
  knex('recipes')
    .update({ version: version + 1, ...rest })
    .where({ recipe_id })
    .then((succ) => succ)
    .catch((err) => {
      return err;
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
  listAllForFeed,
  listSamplesBy,
  searchQuery,
};
