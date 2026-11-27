import type { Card as CardModel, CardMode } from '~/types/game';
import { getCardLabel, useLanguage } from '~/lib/i18n';
import { getActionCardImage } from '~/lib/cardAssets';

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
  const { language, t } = useLanguage();
  const resolvedMode = mode ?? card.mode;
  const cardName = getCardLabel(card.type, t);
  return (
    <button
      ref={ref}
      type='button'
      onClick={onClick}
      style={style}
      className={[
        'relative flex shrink-0 aspect-41/63 cursor-pointer flex-col overflow-hidden rounded-sm',
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
      aria-label={cardName}>
      <img
        src={getActionCardImage(card.type, language)}
        alt={cardName}
        className='w-full h-full object-cover pointer-events-none'
        draggable={false}
      />
    </button>
  );
}
