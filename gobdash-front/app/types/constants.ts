import {
  Recipe,
  Ingredient,
  PreparationStep,
  Card,
  CardTypes,
  DeckOfCards,
} from './game';

const water = new Ingredient(
    'Water',
    'images/game_tokens/ingredient_tokens/1_water.webp',
    false,
  ),
  orange = new Ingredient(
    'Orange',
    'images/game_tokens/ingredient_tokens/9_orange.webp',
    false,
  ),
  eggs = new Ingredient(
    'Eggs',
    'images/game_tokens/ingredient_tokens/6_egg_1.webp',
    true,
    'UNPREPARED',
  ),
  eggs_prepared = new Ingredient(
    'Eggs_Prepared',
    'images/game_tokens/ingredient_tokens/6_egg_2.webp',
    true,
    'PREPARED',
  ),
  bread = new Ingredient(
    'Bread',
    'images/game_tokens/ingredient_tokens/8_bread.webp',
    false,
  ),
  meat = new Ingredient(
    'Meat',
    'images/game_tokens/ingredient_tokens/3_meat_1.webp',
    true,
    'UNPREPARED',
  ),
  meat_prepared = new Ingredient(
    'Meat_Prepared',
    'images/game_tokens/ingredient_tokens/3_meat_2.webp',
    true,
    'PREPARED',
  ),
  potato = new Ingredient(
    'Potato',
    'images/game_tokens/ingredient_tokens/5_potato_1.webp',
    true,
    'UNPREPARED',
  ),
  potato_prepared = new Ingredient(
    'Potato_Prepared',
    'images/game_tokens/ingredient_tokens/5_potato_2.webp',
    true,
    'PREPARED',
  ),
  carrot = new Ingredient(
    'Carrot',
    'images/game_tokens/ingredient_tokens/4_carrot_1.webp',
    true,
    'UNPREPARED',
  ),
  carrot_prepared = new Ingredient(
    'Carrot_Prepared',
    'images/game_tokens/ingredient_tokens/4_carrot_2.webp',
    true,
    'PREPARED',
  ),
  cheese = new Ingredient(
    'Cheese',
    'images/game_tokens/ingredient_tokens/2_cheese.webp',
    false,
  ),
  flour = new Ingredient(
    'Flour',
    'images/game_tokens/ingredient_tokens/7_flour.webp',
    false,
  );

const ingredients: Ingredient[] = [
  water,
  orange,
  eggs,
  eggs_prepared,
  bread,
  meat,
  meat_prepared,
  potato,
  potato_prepared,
  carrot,
  carrot_prepared,
  cheese,
  flour,
];

const recipes: Recipe[] = [
  new Recipe('Water_Cup', 'images/game_tokens/recipe_tokens/01_water.webp', [
    water,
  ]),
  new Recipe(
    'Orange_Juice',
    'images/game_tokens/recipe_tokens/02_orange_juice.webp',
    [orange, water],
  ),
  new Recipe(
    'Fried_Eggs',
    'images/game_tokens/ingredient_tokens/6_egg_2.webp',
    [eggs],
    [PreparationStep.STOVE],
  ),
  new Recipe(
    'Potato_Chips',
    'images/game_tokens/recipe_tokens/04_potato_chips.webp',
    [potato_prepared],
    [PreparationStep.STOVE],
  ),
  new Recipe(
    'Potato_and_Meat',
    'images/game_tokens/recipe_tokens/05_potato_and_meat.webp',
    [potato_prepared, meat_prepared],
  ),
  new Recipe(
    'Egg_Sandwich',
    'images/game_tokens/recipe_tokens/06_bread_egg.webp',
    [eggs_prepared, bread],
    [PreparationStep.STOVE],
  ),
  new Recipe(
    'Burger',
    'images/game_tokens/recipe_tokens/07_burguer.webp',
    [bread, meat_prepared, cheese],
    [PreparationStep.COUNTERTOP],
  ),
  new Recipe(
    'Soup',
    'images/game_tokens/recipe_tokens/08_soup.webp',
    [carrot_prepared, water, potato_prepared, meat_prepared],
    [PreparationStep.STOVE],
  ),
  new Recipe(
    'Carrot_Cake',
    'images/game_tokens/recipe_tokens/09_carrot_cake.webp',
    [eggs, flour, carrot_prepared],
    [PreparationStep.COUNTERTOP, PreparationStep.STOVE],
  ),
  new Recipe(
    'Orange_Pancakes',
    'images/game_tokens/recipe_tokens/10_orange_pancake.webp',
    [eggs, flour, orange, water],
    [PreparationStep.COUNTERTOP, PreparationStep.STOVE],
  ),
];

const CARD_DEFINITIONS: Card[] = [
  // go salon cards:
  new Card(1, CardTypes.GO_SALON),
  new Card(2, CardTypes.GO_SALON),
  new Card(3, CardTypes.GO_SALON),
  new Card(4, CardTypes.GO_SALON),

  // go stove cards:
  new Card(5, CardTypes.GO_STOVE),
  new Card(6, CardTypes.GO_STOVE),
  new Card(7, CardTypes.GO_STOVE),
  new Card(8, CardTypes.GO_STOVE),

  // go pantry cards:
  new Card(9, CardTypes.GO_PANTRY),
  new Card(10, CardTypes.GO_PANTRY),
  new Card(11, CardTypes.GO_PANTRY),
  new Card(12, CardTypes.GO_PANTRY),

  // go countertop cards:
  new Card(13, CardTypes.GO_COUNTERTOP),
  new Card(14, CardTypes.GO_COUNTERTOP),
  new Card(15, CardTypes.GO_COUNTERTOP),
  new Card(16, CardTypes.GO_COUNTERTOP),

  // prepare cards:
  new Card(17, CardTypes.PREPARE),
  new Card(18, CardTypes.PREPARE),
  new Card(19, CardTypes.PREPARE),
  new Card(20, CardTypes.PREPARE),
  new Card(21, CardTypes.PREPARE),
  new Card(22, CardTypes.PREPARE),

  // get cards:
  new Card(23, CardTypes.GET),
  new Card(24, CardTypes.GET),
  new Card(25, CardTypes.GET),
  new Card(26, CardTypes.GET),
  new Card(27, CardTypes.GET),
  new Card(28, CardTypes.GET),

  // let go cards:
  new Card(29, CardTypes.LET_GO),
  new Card(30, CardTypes.LET_GO),
  new Card(31, CardTypes.LET_GO),
  new Card(32, CardTypes.LET_GO),
  new Card(33, CardTypes.LET_GO),
  new Card(34, CardTypes.LET_GO),
];

function createDeck(): DeckOfCards {
  return new DeckOfCards(CARD_DEFINITIONS.map((c) => new Card(c.id, c.type)));
}

const deckOfCards: DeckOfCards = createDeck();

function getPreparedIngredient(food: Ingredient): Ingredient | null {
  if (!food.hasPreparation || food.preparation !== 'UNPREPARED') return null;

  const preparedImages: Record<string, string> = {
    Eggs: 'images/game_tokens/ingredient_tokens/6_egg_2.webp',
    Meat: 'images/game_tokens/ingredient_tokens/3_meat_2.webp',
    Potato: 'images/game_tokens/ingredient_tokens/5_potato_2.webp',
    Carrot: 'images/game_tokens/ingredient_tokens/4_carrot_2.webp',
  };

  const preparedImage = preparedImages[food.name];
  if (!preparedImage) return null;

  return new Ingredient(
    `${food.name}_Prepared`,
    preparedImage,
    true,
    'PREPARED',
  );
}

export {
  ingredients,
  recipes,
  deckOfCards,
  createDeck,
  getPreparedIngredient,
};
