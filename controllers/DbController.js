const knex_config = require('../knex_config');
const knex = require('knex')(knex_config);

const listAll = () => knex('verifications').then((rows) => rows);

const insertRecord = ({ email_address, thryv_id }) =>
  knex('verifications').insert({ email_address, thryv_id });

const retrieveByParams = (params) =>
  knex('verifications')
    .where(params)
    .then((rows) => rows);


var tableUp = function (knex, Promise) {
    return Promise.all([
        knex.schema.createTableIfNotExists("some_table_name", function (table) {
            table.increments(); // integer id

            // name
            table.string('name');

            //description
            table.string('description');

        }).then(function () {
                return knex("some_table_name").insert([
                    {name: "A", description: "A"},
                    {name: "B", description: "BB"},
                    {name: "C", description: "CCC"},
                    {name: "D", description: "DDDD"}
                ]);
            }
        ),
    ]);
};

var down = function (knex, Promise) {
    return Promise.all([
        knex.schema.dropTableIfExists("some_table_name")
    ]);
};

const test = async () => {
	let tableUpTest = await up();
	console.log('tableUpTest: ', tableUpTest);

	let downTest = await down();
	console.log('downTest: ', downTest);

}

// test()

module.exports = {
  listAll,
  insertRecord,
  retrieveByParams,
  tableUp,
  down,
};
