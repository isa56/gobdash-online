import { useDroppable } from '@dnd-kit/react';
import Card from './Card';
import type { Card as CardModel } from '~/types/game';

export const ACTION_SLOT_PREFIX = 'action-slot';
export const DISCARD_SLOT_ID = 'discard-slot';
export function makeSlotId(index: number) {
  return `${ACTION_SLOT_PREFIX}-${index}`;
}

interface ActionSlotProps {
  id: string;
  playedCard: CardModel | null;
  disabled?: boolean;
  onClear?: () => void;
}

export default function ActionSlot({
  id,
  playedCard,
  disabled = false,
  onClear,
}: ActionSlotProps) {
  const { ref, isDropTarget } = useDroppable({ id, disabled });

  return (
    <div
      ref={ref}
      className={[
        // Size matches the card
        'flex w-38 min-h-56 h-full items-center justify-center rounded-xl',
        // Dashed border drop zone
        'border-2 border-dashed transition-all duration-150',
        // Styles based on state
        disabled && !playedCard
          ? 'border-stone-600 bg-stone-900/10 opacity-40 cursor-not-allowed'
          : isDropTarget
            ? 'scale-105 border-amber-400 bg-amber-50/20 shadow-lg shadow-amber-400/30'
            : 'border-stone-400 bg-stone-800/20',
      ].join(' ')}>
      {playedCard ? (
        <div className='relative h-full w-full flex items-center justify-center'>
          <Card card={playedCard} />
          {onClear && (
            <button
              type='button'
              onClick={onClear}
              aria-label='Remove played card'
              className='absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white shadow hover:bg-red-600'>
              X
            </button>
          )}
        </div>
      ) : (
        <span className='select-none text-sm text-stone-400 items-center justify-center'>
          {isDropTarget ? 'Release to play' : 'Drop card here'}
        </span>
      )}
    </div>
  );
}
