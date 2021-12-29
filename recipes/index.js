const express = require('express');
const router = express.Router();

const config = require('knex_config');
const knex = require('knex')(config);

const bodyParser = require('body-parser');
router.use(bodyParser.json());

const RecipesController = require('controllers/RecipesController');
const IngredientsController = require('controllers/IngredientsController');
const DirectionsController = require('controllers/DirectionsController');
const ImagesController = require('controllers/ImagesController');

const storeMeal = require('functions/storeMeal');

router.get('/counts', async ({ query }, res) => {
  let recipesCountRes = await RecipesController.getCount(query);
  res.jsonp({
    success: true,
    data: {
      recipes: recipesCountRes?.count,
    },
  });
});

router.get('/', async ({ query }, res) => {
  const { offset = 0, limit = 10, chef_id, visibility } = query;
  let countResult = await RecipesController.getCount({chef_id, visibility});
  RecipesController.listAllPaginated({ offset: Number(offset), limit:  Number(limit), chef_id, visibility })
    .then(async (rows = []) => {
      if (rows?.length <= 0) {
        let result = {
            data: [],
            nextOffset: 0,
            success: false,
            count: 0,
            hasMore: false,
          }
          // console.log(JSON.stringify(result, null, 2));
          res.jsonp(result);
      }
      // console.log(rows.some(elem => elem.chef_id !== 'ab7NRbbrZd9JjNxo'))
      let i = 0;
      let arr = [];
      for (i = 0; i < rows?.length; i++) {
        let temp = { ...rows[i] };
        temp = await IngredientsController.selectSample({
          recipe_id: temp?.recipe_id,
        }).then((ingredients) => ({ ...temp, ingredients }));

        temp = await DirectionsController.selectSample({
          recipe_id: temp?.recipe_id,
        }).then((directions) => ({ ...temp, directions }));

        temp = await ImagesController.selectSample({
          recipe_id: temp?.recipe_id,
        }).then((images) => ({ ...temp, images }));
        // console.log('temp', temp);

        arr[i] = temp;

        let nextOffset = +offset + +arr.length;

        if (i >= rows?.length - 1 || !rows) {
          let result = {
            data: arr,
            nextOffset,
            success: rows?.length > 0,
            count: countResult?.count,
            hasMore: countResult?.count <= 0 || rows?.length <= 0 || !(nextOffset >= countResult?.count),
          }
          // console.log(JSON.stringify(result, null, 2));
          res.jsonp(result);
          return;
        }
      }
    }).catch((err) => {
      console.log({err})
    })
});

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
