import type { Card as CardModel } from '~/types/game';
import ActionSlot, { makeSlotId } from './ActionSlot';
import Card from './Card';

interface CardTableProps {
  cards: CardModel[] | null;
  playedCards: Record<string, CardModel>;
  onClearSlot: (slotId: string) => void;
  turnPhase: 'use' | 'buy';
  boughtCard: CardModel | null;
  onBuyCard: (card: CardModel) => void;
}

export default function CardTable({
  cards,
  playedCards,
  onClearSlot,
  turnPhase,
  boughtCard,
  onBuyCard,
}: CardTableProps) {
  const isBuyPhase = turnPhase === 'buy';
  const hasPlayedThisTurn = Object.keys(playedCards).length > 0;

  function slotProps(slotId: string) {
    const playedCard = playedCards[slotId] ?? null;
    return {
      id: slotId,
      playedCard,
      disabled: isBuyPhase || (hasPlayedThisTurn && !playedCard),
      onClear: () => onClearSlot(slotId),
    };
  }

  return (
    <div className='card-table flex flex-wrap justify-center items-center gap-2'>
      {/* Leading slot — insert before the first card */}
      <div className='px-1'>
        <ActionSlot key={makeSlotId(0)} {...slotProps(makeSlotId(0))} />
      </div>

      {cards &&
        cards.length > 0 &&
        cards.map((card, index) => {
          const slotId = makeSlotId(index + 1);
          const isSelected = isBuyPhase && boughtCard?.id === card.id;

          return (
            <div className='flex items-center' key={card.id}>
              <div className='px-1'>
                {isBuyPhase ? (
                  <button
                    type='button'
                    onClick={() => onBuyCard(card)}
                    aria-label={`Buy ${card.type}`}
                    className={[
                      'rounded-xl transition-all duration-150 cursor-pointer',
                      isSelected
                        ? 'ring-4 ring-amber-400 scale-105 shadow-lg shadow-amber-400/30'
                        : 'hover:ring-2 hover:ring-amber-300 hover:scale-105',
                    ].join(' ')}>
                    <Card card={card} />
                  </button>
                ) : (
                  <Card card={card} />
                )}
              </div>
              <div className='px-1'>
                <ActionSlot key={slotId} {...slotProps(slotId)} />
              </div>
            </div>
          );
        })}
    </div>
  );
}

