import {
  Recipe,
  Ingredient,
  PreparationStep,
  Card,
  CardTypes,
  DeckOfCards,
} from './game';

const water = new Ingredient('Water', false),
  orange = new Ingredient('Orange', false),
  eggs = new Ingredient('Eggs', true, 'UNPREPARED'),
  eggs_prepared = new Ingredient('Eggs_Prepared', true, 'PREPARED'),
  bread = new Ingredient('Bread', false),
  meat = new Ingredient('Meat', true, 'UNPREPARED'),
  meat_prepared = new Ingredient('Meat_Prepared', true, 'PREPARED'),
  potato = new Ingredient('Potato', true, 'UNPREPARED'),
  potato_prepared = new Ingredient('Potato_Prepared', true, 'PREPARED'),
  carrot = new Ingredient('Carrot', true, 'UNPREPARED'),
  carrot_prepared = new Ingredient('Carrot_Prepared', true, 'PREPARED'),
  cheese = new Ingredient('Cheese', false),
  flour = new Ingredient('Flour', false);

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
  new Recipe('Water_Cup', [water]),
  new Recipe('Orange_Juice', [orange, water]),
  new Recipe('Fried_Eggs', [eggs], [PreparationStep.STOVE]),
  new Recipe('Potato_Chips', [potato_prepared], [PreparationStep.STOVE]),
  new Recipe('Potato_and_Meat', [potato_prepared, meat_prepared]),
  new Recipe('Egg_Sandwich', [eggs_prepared, bread], [PreparationStep.STOVE]),
  new Recipe(
    'Burger',
    [bread, meat_prepared, cheese],
    [PreparationStep.COUNTERTOP],
  ),
  new Recipe(
    'Soup',
    [carrot_prepared, water, potato_prepared, meat_prepared],
    [PreparationStep.STOVE],
  ),
  new Recipe(
    'Carrot_Cake',
    [eggs, flour, carrot_prepared],
    [PreparationStep.COUNTERTOP, PreparationStep.STOVE],
  ),
  new Recipe(
    'Orange_Pancakes',
    [eggs, flour, orange, water],
    [PreparationStep.COUNTERTOP, PreparationStep.STOVE],
  ),
];

const originalDeckOfCards: DeckOfCards = new DeckOfCards([
  // go sallon cards:
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
]);

const deckOfCards: DeckOfCards = new DeckOfCards([...originalDeckOfCards.cards]);

export { ingredients, recipes, deckOfCards };
