import { publicAssetPath } from '~/lib/assets';
import type { Language } from '~/lib/i18n';
import { CardTypes } from '~/types/game';

const actionCardFiles: Record<CardTypes, string> = {
  [CardTypes.GO_SALON]: 'go_salon.webp',
  [CardTypes.GO_STOVE]: 'go_stove.webp',
  [CardTypes.GO_PANTRY]: 'go_pantry.webp',
  [CardTypes.GO_COUNTERTOP]: 'go_countertop.webp',
  [CardTypes.PREPARE]: 'prepare.webp',
  [CardTypes.GET]: 'get.webp',
  [CardTypes.LET_GO]: 'let_go.webp',
};

const recipeCardFiles: Record<string, string> = {
  Water_Cup: '01_water.webp',
  Orange_Juice: '02_orange_juice.webp',
  Fried_Eggs: '03_fried_egg.webp',
  Potato_Chips: '04_potato_chips.webp',
  Potato_and_Meat: '05_potato_meat.webp',
  Egg_Sandwich: '06_bread_egg.webp',
  Burger: '07_burguer.webp',
  Soup: '08_soup.webp',
  Carrot_Cake: '09_carrot_cake.webp',
  Orange_Pancakes: '10_orange_pancake.webp',
};

function cardAssetPath(
  category: 'action_cards' | 'recipe_cards',
  fileName: string,
  language: Language,
) {
  const localizedPath = `images/cards/${language}/${category}/${fileName}`;
  const englishPath = `images/cards/${category}/${fileName}`;
  return publicAssetPath(language === 'en' ? englishPath : localizedPath);
}

export function getActionCardImage(type: CardTypes, language: Language) {
  return cardAssetPath('action_cards', actionCardFiles[type], language);
}

export function getRecipeCardImage(name: string, language: Language) {
  const fileName = recipeCardFiles[name];
  if (!fileName) {
    throw new Error(`Unknown recipe card: ${name}`);
  }
  return cardAssetPath('recipe_cards', fileName, language);
}
