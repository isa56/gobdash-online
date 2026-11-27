import type { Recipe } from '~/types/game';
import { getRecipeCardImage } from '~/lib/cardAssets';
import { getRecipeLabel, useLanguage } from '~/lib/i18n';

function RecipeCard({ recipe }: { recipe: Recipe | null }) {
  const { language, t } = useLanguage();

  return (
    <div className='recipe-card relative flex w-32 shrink-0 aspect-41/63 flex-col overflow-hidden rounded-sm shadow-md'>
      {recipe ? (
        <img
          src={getRecipeCardImage(recipe.name, language)}
          alt={getRecipeLabel(recipe.name, t)}
          className='w-full h-full object-cover pointer-events-none'
          draggable={false}
        />
      ) : (
        <p className='flex h-full items-center justify-center p-2 text-center text-sm text-gray-500'>
          {t('noRecipeAvailable')}
        </p>
      )}
    </div>
  );
}

export default RecipeCard;
