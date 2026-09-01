import { Recipe, Ingredient, PreparationStep } from './game';

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
