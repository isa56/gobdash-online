import type { Card as CardModel, CardMode } from '~/types/game';

interface CardProps {
  card: CardModel;
  /** Override the mode for display without mutating the card instance. */
  mode?: CardMode;
  selected?: boolean;
  onClick?: () => void;
  ref?: React.Ref<HTMLButtonElement>;
  style?: React.CSSProperties;
  className?: string;
}

export default function Card({
  card,
  mode,
  selected = false,
  onClick,
  ref,
  style,
  className,
}: CardProps) {
  const resolvedMode = mode ?? card.mode;
  return (
    <button
      ref={ref}
      type='button'
      onClick={onClick}
      style={style}
      className={[
        'relative flex shrink-0 aspect-[5/7] cursor-pointer flex-col overflow-hidden rounded-sm',
        'shadow-md outline-2 outline-transparent',
        'transition-all duration-150 ease-out',
        'hover:-translate-y-1 hover:shadow-xl',
        resolvedMode === 'normal' || resolvedMode === 'staged' ? 'w-32' : '',
        resolvedMode === 'discarded' ? 'w-26' : '',
        selected
          ? 'outline-amber-400 ring-2 ring-amber-400 ring-offset-1'
          : 'hover:outline-amber-300',
        className ?? '',
      ].join(' ')}
      aria-pressed={selected}
      aria-label={card.type}>
      <img
        src={card.image}
        alt={card.type}
        className='w-full h-full object-cover pointer-events-none'
        draggable={false}
      />
    </button>
  );
}

