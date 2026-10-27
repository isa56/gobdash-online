import { useDroppable } from '@dnd-kit/react';
import Card from './Card';
import type { Card as CardModel } from '~/types/game';
import { DISCARD_SLOT_ID } from '~/lib/slots';

interface DiscardPileProps {
  /** Cards already confirmed into the discard pile. */
  pile: CardModel[];
  /** Card currently staged (dragged) onto the discard slot but not yet confirmed. */
  stagedCard: CardModel | null;
  /** Whether this slot should be locked (another slot is already filled this turn). */
  disabled?: boolean;
  /** Called when the player clicks X to return the staged card to hand. */
  onClearStaged?: () => void;
}

export default function DiscardPile({
  pile,
  stagedCard,
  disabled = false,
  onClearStaged,
}: DiscardPileProps) {
  const { ref, isDropTarget } = useDroppable({ id: DISCARD_SLOT_ID, disabled });

  const topCard = pile[pile.length - 1] ?? null;

  return (
    <div className='flex flex-col items-center gap-2'>
      <p className='text-sm font-semibold uppercase tracking-widest text-stone-400'>
        Discard
      </p>

      <div
        ref={ref}
        className={[
          'relative flex w-38 min-h-56 h-full items-center justify-center rounded-xl',
          'border-2 border-dashed transition-all duration-150',
          disabled && !stagedCard
            ? 'border-stone-600 bg-stone-900/10 opacity-40 cursor-not-allowed'
            : isDropTarget
              ? 'scale-105 border-red-400 bg-red-50/10 shadow-lg shadow-red-400/30'
              : stagedCard
                ? 'border-red-400 bg-red-50/10'
                : 'border-stone-400 bg-stone-800/20',
        ].join(' ')}>
        {stagedCard ? (
          <div className='relative flex items-center justify-center h-full w-full'>
            <Card card={stagedCard} />
            {onClearStaged && (
              <button
                type='button'
                onClick={onClearStaged}
                aria-label='Return staged card to hand'
                className='absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white shadow hover:bg-red-600'>
                X
              </button>
            )}
            <span className='absolute bottom-1 left-0 right-0 text-center text-xs text-red-300 font-semibold'>
              Will discard
            </span>
          </div>
        ) : topCard ? (
          <div className='flex items-center justify-center h-full w-full'>
            <Card card={topCard} />
          </div>
        ) : (
          <span className='select-none text-sm text-stone-400 text-center px-2'>
            {isDropTarget ? 'Release to discard' : 'Drop to discard'}
          </span>
        )}
      </div>

      {pile.length > 0 && (
        <span className='text-xs text-stone-400'>
          {pile.length} card{pile.length !== 1 ? 's' : ''}
        </span>
      )}
    </div>
  );
}

