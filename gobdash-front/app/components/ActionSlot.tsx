import { useDroppable } from '@dnd-kit/react';
import Card from './Card';
import type { Card as CardModel } from '~/types/game';

export const ACTION_SLOT_ID = 'action-slot';

interface ActionSlotProps {
  playedCard: CardModel | null;
  onClear?: () => void;
}

export default function ActionSlot({ playedCard, onClear }: ActionSlotProps) {
  const { ref, isDropTarget } = useDroppable({ id: ACTION_SLOT_ID });

  return (
    <div
      ref={ref}
      className={[
        // Size matches the card
        'flex w-36 min-h-48 h-full items-center justify-center rounded-xl',
        // Dashed border drop zone
        'border-2 border-dashed transition-all duration-150',
        // Highlight when hovered during drag
        isDropTarget
          ? 'scale-105 border-amber-400 bg-amber-50/20 shadow-lg shadow-amber-400/30'
          : 'border-stone-400 bg-stone-800/20',
      ].join(' ')}>
      {playedCard ? (
        <div className='relative h-full w-full'>
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
        <span className='select-none text-sm text-stone-400'>
          {isDropTarget ? 'Release to play' : 'Drop card here'}
        </span>
      )}
    </div>
  );
}

