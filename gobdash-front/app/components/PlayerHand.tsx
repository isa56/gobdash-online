import { DragOverlay } from '@dnd-kit/react';
import DraggableCard from './DraggableCard';
import type { Card as CardModel } from '~/types/game';
import Card from './Card';
import DiscardPile from './DicardPile';

interface PlayerHandProps {
  hand: CardModel[] | null;
  draggingCard: CardModel | null;
  discardPile: CardModel[];
  stagedDiscardCard: CardModel | null;
  discardDisabled?: boolean;
  onClearStagedDiscard?: () => void;
}

function PlayerHand({
  hand,
  draggingCard,
  discardPile,
  stagedDiscardCard,
  discardDisabled = false,
  onClearStagedDiscard,
}: PlayerHandProps) {
  return (
    <>
      <div className='flex items-end justify-center gap-6 w-95/100 mb-4'>
        {/* Fan of cards */}
        <div className='flex flex-col gap-2 flex-1 items-center'>
          <p className='text-sm font-semibold uppercase tracking-widest text-stone-400'>
            Hand
          </p>
          <div className='flex items-center justify-center w-full gap-4'>
            {hand
              ? hand.map((card, index) => {
                  const angle = (index - (hand.length - 1) / 2) * 4.5;
                  const verticalOffset = angle * angle * 0.4;
                  return (
                    <div
                      key={card.id}
                      style={{
                        transform: `translateY(${verticalOffset}px) rotate(${angle}deg)`,
                        transformOrigin: 'bottom center',
                      }}
                      className='shrink-0'>
                      <DraggableCard card={card} />
                    </div>
                  );
                })
              : null}
          </div>
        </div>

        {/* Discard pile — always visible to the right of the hand */}
        <DiscardPile
          pile={discardPile}
          stagedCard={stagedDiscardCard}
          disabled={discardDisabled}
          onClearStaged={onClearStagedDiscard}
        />
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
