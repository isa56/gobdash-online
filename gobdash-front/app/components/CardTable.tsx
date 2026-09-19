import type { Card as CardModel } from '~/types/game';
import ActionSlot, { makeSlotId } from './ActionSlot';
import Card from './Card';

interface CardTableProps {
  cards: CardModel[] | null;
  playedCards: Record<string, CardModel>;
  onClearSlot: (slotId: string) => void;
}

function CardTable({ cards, playedCards, onClearSlot }: CardTableProps) {
  // Once one slot has a card, all other empty slots are locked for this turn
  const hasPlayedThisTurn = Object.keys(playedCards).length > 0;

  function slotProps(slotId: string) {
    const playedCard = playedCards[slotId] ?? null;
    return {
      id: slotId,
      playedCard,
      // disable empty slots only when another slot is already filled
      disabled: hasPlayedThisTurn && !playedCard,
      onClear: () => onClearSlot(slotId),
    };
  }

  return (
    <>
      <div className='card-table flex flex-wrap justify-center items-center gap-2'>
        <div className='px-1'>
          <ActionSlot {...slotProps(makeSlotId(0))} />
        </div>

        {cards &&
          cards.length > 0 &&
          cards.map((card, index) => {
            const slotId = makeSlotId(index + 1);
            return (
              <div className='flex' key={card.id}>
                <div className='px-1'>
                  <Card card={card} />
                </div>
                <div className='px-1'>
                  <ActionSlot {...slotProps(slotId)} />
                </div>
              </div>
            );
          })}
      </div>
    </>
  );
}

export default CardTable;
