const Hashids = require('hashids');
var hashids = new Hashids(global.salt, 16);

const knexfile = require('knex_config');
const knex = require('knex')(knexfile);

const listAll = (data) => {
  // console.log(data)
  const {name,food_id,chef_id,recipe_id,...rest}=data
  return knex('foods')
  .where({chef_id})
  .where({name})
  .orWhere({food_id})
  .then(rows => rows)
  .catch(err => err)
  }

const insertRecord = (arrData) => knex('foods')
  .insert(arrData)
  .onConflict('id','recipe_id','chef_id')
  .merge()
  .catch(err => {
    console.log({err})
    return err;
  })

const updateRecord = ({id,food_id,...rest}) => knex('foods')
  .where({food_id})
  .update(rest)
  .then(succ => succ)
  .catch(err => err);

const selectRecord = (query) => knex('foods')
  .select()
  .where(query)
  .then(succ => succ)
  .catch(err => err);

module.exports = {
  listAll,
  insertRecord,
  selectRecord,
  updateRecord,
}