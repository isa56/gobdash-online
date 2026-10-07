import DraggableCard from './DraggableCard';
import type { Card as CardModel } from '~/types/game';

interface PlayerHandProps {
  hand: CardModel[] | null;
  turnPhase: 'use' | 'buy';
}

export default function PlayerHand({ hand, turnPhase }: PlayerHandProps) {
  const isBuyPhase = turnPhase === 'buy';

  return (
    <>
      <div className='flex flex-col items-center gap-2 w-100 mb-4'>
        {/* Fan of cards */}
        <p className='text-sm font-semibold uppercase tracking-widest text-stone-400'>
          Hand
        </p>
        <div className='flex items-center justify-center w-full gap-4'>
          {hand?.map((card, index) => {
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
                <DraggableCard card={card} disabled={isBuyPhase} />
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

