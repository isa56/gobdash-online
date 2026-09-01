import type { Card as CardModel } from '~/types/game';

interface CardProps {
  card: CardModel;
  selected?: boolean;
  onClick?: () => void;
  ref?: React.Ref<HTMLButtonElement>;
  style?: React.CSSProperties;
  className?: string;
}

export default function Card({ card, selected = false, onClick, ref, style, className }: CardProps) {
  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      style={style}
      className={[
        // Layout & shape
        'relative flex w-36 shrink-0 cursor-pointer flex-col overflow-hidden rounded-sm',
        // Shadow & border
        'shadow-md outline-2 outline-transparent',
        // Transition
        'transition-all duration-150 ease-out',
        // Hover
        'hover:-translate-y-1 hover:shadow-xl',
        // Selected state — amber ring to match the warm wood tones in the cards
        selected
          ? 'outline-amber-400 ring-2 ring-amber-400 ring-offset-1'
          : 'hover:outline-amber-300',
        className ?? '',
      ].join(' ')}
      aria-pressed={selected}
      aria-label={card.type}
    >
      <img
        src={card.image}
        alt={card.type}
        className="w-full h-full object-cover pointer-events-none"
        draggable={false}
      />
    </button>
  );
}
