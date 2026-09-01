import { DragOverlay } from '@dnd-kit/react';
import DraggableCard from './DraggableCard';
import type { Card as CardModel } from '~/types/game';
import Card from './Card';

interface PlayerHandProps {
  hand: CardModel[] | null;
  draggingCard: CardModel | null;
}

function PlayerHand({ hand, draggingCard }: PlayerHandProps) {
  return (
    <>
      <div className='flex flex-col gap-2 w-full items-center mb-4'>
        <p className='text-sm font-semibold uppercase tracking-widest text-stone-400'>
          Hand
        </p>
        <div className='flex items-center justify-center w-full gap-4'>
          {hand
            ? hand.map((card, index) => {
                const angle = (index - (hand.length - 1) / 2) * 4.5; // Adjust the multiplier for more or less rotation
                const verticalOffset = angle * angle * 0.4; // Parabolic curve: edges dip down
                return (
                  <div
                    key={card.id}
                    style={{
                      transform: `translateY(${verticalOffset}px) rotate(${angle}deg)`,
                      transformOrigin: 'bottom center',
                    }}
                    className='shrink-0'
                    >
                    <DraggableCard card={card} />
                  </div>
                );
              })
            : null}
        </div>
      </div>

      {/* Drag overlay - renders the card clone that follows the cursor */}
      <DragOverlay>
        {draggingCard ? (
          <div className='rotate-3 scale-110 drop-shadow-2xl'>
            <Card card={draggingCard} />
          </div>
        ) : null}
      </DragOverlay>
    </>
  );
}

export default PlayerHand;
