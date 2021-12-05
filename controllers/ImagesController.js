const Hashids = require('hashids');
var hashids = new Hashids('ALL YOU CAN EAT', 16);

const knexfile = require('knex_config');
const knex = require('knex')(knexfile);

const listAll = () =>
  knex('images')
    .then((rows) => rows)
    .catch((err) => err);

const insertRecord = (params) => {
  // console.log({ params });
  return (
    knex('images')
      .insert({...params, image_id: `image_${hashids.encode(String(Date.now()))}`})
      // .onConflict('username','chef_id')
      // .merge()
      .then((result) => result)
      .catch((err) => ({ err }))
  );
};

const updateRecord = ({ chef_id, ...rest }) => {
  // console.log({id,chef_id,})
  return (
    knex('images')
      // .where({id})
      .where({ chef_id })
      // .orWhere({ recipe_id })
      .update({ ...rest })
      .then((succ) => succ)
      .catch((err) => err)
  );
};

const selectRecord = (query) =>
  knex('images')
    .select()
    .where(query)
    .first()
    .then((succ) => succ)
    .catch((err) => ({ err }));

const selectSample = (query) =>
  knex('images')
    .select(
      'images.id',
      'images.url',
      'images.recipe_id',
    )
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
