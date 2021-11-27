const express = require('express');
const router = express.Router();

const config = require('knex_config');
const knex = require('knex')(config);

const bodyParser = require('body-parser');
router.use(bodyParser.json());

const RecipesController = require('controllers/RecipesController');
const IngredientsController = require('controllers/IngredientsController');
const DirectionsController = require('controllers/DirectionsController');

const storeMeal = require('functions/storeMeal');

router.get('/', ({ params }, res) =>
  RecipesController.listAll()
    .then((result) => res.jsonp(result))
    .catch((err) => {
      console.log('err: ', err);
      res.jsonp({ err });
    }),
);

router.get('/:chef_id', ({ params }, res) => {
  RecipesController.listSamplesBy(params)
    .then((result) => {
      let recipes = result;
      let recipe_ids = recipes.map((item) => item.recipe_id);
      if (recipes.length > 0) {
        recipe_ids.forEach(async (recipe_id, index) => {
          // get all ingredients
          let ingredients = await IngredientsController.selectSample({ recipe_id });
          recipes[index].ingredients = ingredients;

          // get all directions
          let directions = await DirectionsController.selectSample({ recipe_id });
          recipes[index].directions = directions;

          if (index >= recipes.length - 1)
            res.jsonp({ success: !!result, data: recipes });
        });
      } else res.jsonp({ success: !!result, data: recipes });
    })
    .catch((err) => {
      console.log('err: ', err);
      res.jsonp({ err, success: false });
    });
});

router.post('/', ({ body }, res) => {
  storeMeal(body)
    .then((result) => res.jsonp(result))
    .catch((err) => {
      console.log('err: ', err);
      res.jsonp({ err: err.toString(), success: false });
    });
});

module.exports = router;
