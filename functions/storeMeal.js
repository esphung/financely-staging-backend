const SALT = 'ALL YOU CAN EAT';

const Hashids = require('hashids');
const hashids = new Hashids(SALT, 16);

global.salt = SALT;

const randomMath = () => Math.random().toString(36).substr(2); // remove `0.`
const generateToken = () => randomMath() + randomMath(); // "bnh5yzdirjinqaorq0ox1tf383nb3xr"

const UsersController = require('controllers/UsersController');
const RecipesController = require('controllers/RecipesController');
const FoodsController = require('controllers/FoodsController');
const IngredientsController = require('controllers/IngredientsController');
const DirectionsController = require('controllers/DirectionsController');
// var faker = require('faker');

// meals and sauces
const test_recipe = {
  name: "Bob's Sphagetti",
  description: 'Some really good meatballs and aioli sauce',
  // categories: [],
  chef_id: 'vLQwl33nDjXy1NyW',
  ingredients: [
    // {
    //   name: 'angel hair pasta'
    // },
    // {unit:'floz',count: faker.datatype.number(32),
    //  name: 'tomato sauce'},
    // {unit:'pieces',count: faker.datatype.number(32),
    //  name: 'meatballs'},
  ],
  // recipes: [], // other recipes...sauces
  minutes: 45, // integer minutes
  // notes: [],
  difficulty: 0.15,
  rating: 0.65,
  favorite: false,
  // directions: [], // list steps
};

async function storeMeal(recipe) {
  console.log('recipe: ', recipe);
  let temp = { success: false, message: '' };
  let { ingredients, directions, ...rest } = recipe;
  let recipe_id = hashids.encode(String(Date.now()));
  console.log('recipe_id', recipe_id);
  let params = {
    ...rest,
    recipe_id,
  };
  let recipeResult = await RecipesController.insertRecord(params);
  console.log({recipeResult});
  let newRecipe = await RecipesController.selectRecord({ recipe_id });
  temp = {
    ...temp,
    success: !!newRecipe && recipeResult.length > 0,
    data: { ...recipe, ...newRecipe },
  };

  if (recipe?.ingredients?.length > 0) {
    const fieldsToInsert = ingredients?.map((ingredient, index) => ({
      ...ingredient,
      recipe_id,
      chef_id: recipe.chef_id,
      ingredient_id: hashids.encode(String(Date.now() + index)),
    }));
    console.log('fieldsToInsert: ', fieldsToInsert);
    let newIngredientsResult = await IngredientsController.insertRecord(
      fieldsToInsert,
    );

    temp = {
      ...temp,
      success: true,
      message: (temp.message += 'Added ingredients.'),
    };
  }

  if (recipe?.directions?.length > 0) {
    const fieldsToInsert = directions?.map((direction, index) => ({
      ...direction,
      num: index,
      recipe_id,
      chef_id: recipe.chef_id,
      direction_id: hashids.encode(String(Date.now() + index)),
    }));
    // console.log('fieldsToInsert: ', fieldsToInsert);
    let newDirectionsResult = await DirectionsController.insertRecord(fieldsToInsert);
    // console.log('newDirectionsResult: ', newDirectionsResult);

    temp = {
      ...temp,
      success: true,
      message: (temp.message += ' Added directions.'),
    };
  }
  console.log('temp: ', temp);
  return temp;
}

// storeMeal(test_recipe);

module.exports = storeMeal;
