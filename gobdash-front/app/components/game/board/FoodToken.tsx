import type { Ingredient as FoodModel } from '~/types/game';

interface FoodProps {
  food: FoodModel;
  selected?: boolean;
  onClick?: () => void;
  ref?: React.Ref<HTMLButtonElement>;
  style?: React.CSSProperties;
  className?: string;
}

export default function Food({
  food,
  selected = false,
  onClick,
  ref,
  style,
  className,
}: FoodProps) {
  return (
    <button
      ref={ref}
      type='button'
      onClick={onClick}
      style={style}
      className={[
        'relative flex shrink-0 cursor-pointer flex-col overflow-hidden rounded-sm',
        'shadow-md outline-2 outline-transparent',
        'transition-all duration-150 ease-out',
        'hover:-translate-y-1 hover:shadow-xl',
        selected
          ? 'outline-amber-400 ring-2 ring-amber-400 ring-offset-1'
          : 'hover:outline-amber-300',
        className ?? '',
      ].join(' ')}
      aria-pressed={selected}
      aria-label={food.name}>
      <img
        src={food.image}
        alt={food.name}
        className='w-full h-full object-cover pointer-events-none'
        draggable={false}
      />
    </button>
  );
}

