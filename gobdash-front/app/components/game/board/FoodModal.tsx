import { useRef } from 'react';
import { publicAssetPath } from '~/lib/assets';
import { useGameStore } from '~/store/gameStore';
import { ingredients } from '~/types/constants';
import type { Ingredient } from '~/types/game';
import { getIngredientLabel, useLanguage } from '~/lib/i18n';

interface FoodModalProps {
  open: boolean;
  onClose: () => void;
}

function FoodModal({ open, onClose }: FoodModalProps) {
  const { t } = useLanguage();
  const addFood = useGameStore((state) => state.addFood);
  const foodTokens = useGameStore((state) => state.foodTokens);
  const nextFoodId = useRef(
    foodTokens.reduce((highest, token) => Math.max(highest, token.id), 0) + 1,
  );

  const addFoodToPantry = (food: Ingredient) => {
    const id = nextFoodId.current++;
    addFood({ id, food });
    onClose();
  };

  if (!open) return null;

  return (
    <div
      className='absolute inset-0 z-50 flex items-center justify-center bg-stone-950/70 p-4 backdrop-blur-sm'
      role='dialog'
      aria-modal='true'
      aria-label={t('chooseFoodToken')}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}>
      <div className='flex max-h-[80%] w-[88%] flex-col rounded-2xl border border-amber-200/40 bg-stone-900 p-4 shadow-2xl'>
        <div className='mb-3 flex items-center justify-between'>
          <h2 className='font-bold text-amber-100'>{t('chooseIngredient')}</h2>
          <button
            type='button'
            onClick={onClose}
            aria-label={t('closeFoodChooser')}
            className='rounded-full px-3 py-1 text-xl text-amber-100 hover:bg-stone-700'>
            ×
          </button>
        </div>
        <div className='grid grid-cols-4 gap-3 overflow-y-auto pr-1'>
          {ingredients
            .filter((food) => food.preparation !== 'PREPARED')
            .map((food) => (
              <button
                key={food.name}
                type='button'
                onClick={() => addFoodToPantry(food)}
                className='aspect-square overflow-hidden rounded-lg border-2 border-transparent bg-stone-800 transition hover:border-amber-300 hover:scale-105'
                aria-label={t('addFoodToPantry', {
                  food: getIngredientLabel(food.name, t),
                })}>
                <img
                  src={publicAssetPath(food.image)}
                  alt={getIngredientLabel(food.name, t)}
                  className='h-full w-full object-cover'
                />
              </button>
            ))}
        </div>
      </div>
    </div>
  );
}

export default FoodModal;