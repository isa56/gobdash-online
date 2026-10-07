import { useDroppable } from '@dnd-kit/react';
import Card from './Card';
import type { Card as CardModel } from '~/types/game';
import { ACTION_SLOT_PREFIX, DISCARD_SLOT_ID, makeSlotId } from '~/lib/slots';

export { ACTION_SLOT_PREFIX, DISCARD_SLOT_ID, makeSlotId };

interface ActionSlotProps {
  id: string;
  playedCard: CardModel | null;
  disabled?: boolean;
  isExpandable?: boolean;
  onClear?: () => void;
}

function DroppableSlot({
  id,
  playedCard,
  disabled = false,
  isExpandable = false,
  onClear,
}: ActionSlotProps) {
  const { ref, isDropTarget } = useDroppable({
    id,
    disabled,
    accept: 'card',
  });
  const isCollapsible = isExpandable && !playedCard;

  return (
    <div
      ref={ref}
      className={[
        'group flex min-h-56 h-full items-center justify-center rounded-xl shrink-0',
        'border-2 border-dashed transition-all duration-200 ease-in-out overflow-hidden',
        isCollapsible
          ? isDropTarget
            ? 'w-38 scale-105 border-amber-400 bg-amber-50/20 shadow-lg shadow-amber-400/30'
            : [
                'w-8',
                !disabled &&
                  'hover:w-38 hover:border-amber-400/80 hover:bg-stone-800/60 cursor-pointer',
                disabled
                  ? 'border-stone-600/50 bg-stone-900/20 opacity-40 cursor-not-allowed'
                  : 'border-stone-400/80 bg-stone-800/40',
              ]
                .filter(Boolean)
                .join(' ')
          : [
              'w-38',
              disabled && !playedCard
                ? 'border-stone-600 bg-stone-900/10 opacity-40 cursor-not-allowed'
                : isDropTarget
                  ? 'scale-105 border-amber-400 bg-amber-50/20 shadow-lg shadow-amber-400/30'
                  : 'border-stone-400 bg-stone-800/20',
            ].join(' '),
      ].join(' ')}>
      {playedCard ? (
        <div className='relative h-full w-full flex items-center justify-center'>
          <Card card={playedCard} />
          {onClear && (
            <button
              type='button'
              onClick={onClear}
              aria-label='Remove played card'
              className='absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white shadow hover:bg-red-600 cursor-pointer'>
              X
            </button>
          )}
        </div>
      ) : isCollapsible && !isDropTarget ? (
        <div className='relative flex items-center justify-center w-full h-full'>
          <span
            aria-hidden='true'
            className={[
              'select-none text-base font-bold transition-all duration-150',
              disabled
                ? 'text-stone-600'
                : 'text-stone-300 group-hover:text-amber-400 group-hover:opacity-0',
            ].join(' ')}>
            +
          </span>
          {!disabled && (
            <span className='absolute select-none text-sm text-stone-300 whitespace-nowrap text-center opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
              Drop card here
            </span>
          )}
        </div>
      ) : (
        <span
          className={[
            'select-none text-sm text-stone-400 whitespace-nowrap text-center transition-opacity duration-150',
            isDropTarget ? 'opacity-100!' : '',
          ].join(' ')}>
          {isDropTarget ? 'Release to play' : 'Drop card here'}
        </span>
      )}
    </div>
  );
}

export default function ActionSlot(props: ActionSlotProps) {
  return <DroppableSlot key={props.id} {...props} />;
}

