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

router.get('/', async ({ query }, res) => {
  const { offset = 0, limit = 10 } = query;
  let countResult = await RecipesController.getCount()
  // console.log('countResult', countResult)
  // console.log(countResult?.count);
  // console.log({offset});
  RecipesController.listAllPaginated({ offset, limit }).then(async (rows) => {
    let i = 0;
    let arr = [];
    for (i = 0; i < rows.length; i++) {
      let temp = { ...rows[i] };
      temp = await IngredientsController.selectSample({
        recipe_id: temp.recipe_id,
      }).then((ingredients) => ({ ...temp, ingredients }));

      temp = await DirectionsController.selectSample({
        recipe_id: temp.recipe_id,
      }).then((directions) => ({ ...temp, directions }));

      temp = await ImagesController.selectSample({
        recipe_id: temp.recipe_id,
      }).then((images) => ({ ...temp, images }));
      // console.log('temp', temp);

      arr[i] = temp;
      // console.log('arr[i].id', arr[i].id);
      // console.log('arr.length', arr.length);

      let nextOffset = +offset + +arr.length; // Number(offset) + Number(arr.length)
      // console.log('nextOffset', nextOffset)
      if (i >= rows.length - 1 || !rows) {
        res.jsonp({
          data: arr,
          nextOffset,
          success: true,
          count: countResult?.count,
          hasMore: !(nextOffset >= countResult?.count),
        });
        return;
      }
    }
  });
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
