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
      .insert(params)
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

module.exports = {
  listAll,
  insertRecord,
  selectRecord,
  updateRecord,
};

async function main () {
  // body...
  console.log('await listAll(): ', await listAll());
}
main()