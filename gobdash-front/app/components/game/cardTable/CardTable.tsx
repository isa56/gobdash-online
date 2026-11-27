import type { Card as CardModel, CardMode } from '~/types/game';
import CardActionSlot, { makeSlotId } from './CardActionSlot';
import Card from './Card';
import CodeTokenSlot from './CodeTokenSlot';
import type { CodeTokenType } from './CodeToken';
import { makeCardTokenId } from '~/lib/slots';

interface CardTableProps {
  cards: CardModel[] | null;
  playedCards: Record<string, CardModel>;
  /** Mode lookup sourced from the store; avoids relying on mutated card instances. */
  cardModes: Record<number, CardMode>;
  onClearSlot: (slotId: string) => void;
  turnPhase: 'use' | 'buy';
  boughtCard: CardModel | null;
  onBuyCard: (card: CardModel) => void;
  placedTokens: Record<number, CodeTokenType>;
  onClearToken: (cardId: number) => void;
  selectedCardId?: number;
  onSelectCardDestination?: (slotId: string) => void;
  selectedToken?: CodeTokenType;
  onSelectToken?: (token: CodeTokenType) => void;
  onMoveToken?: (targetId: string) => void;
}

export default function CardTable({
  cards,
  playedCards,
  cardModes,
  onClearSlot,
  turnPhase,
  boughtCard,
  onBuyCard,
  placedTokens,
  onClearToken,
  selectedCardId,
  onSelectCardDestination,
  selectedToken,
  onSelectToken,
  onMoveToken,
}: CardTableProps) {
  const isBuyPhase = turnPhase === 'buy';
  const hasPlayedThisTurn = Object.keys(playedCards).length > 0;

  function slotProps(slotId: string) {
    const playedCard = playedCards[slotId] ?? null;
    return {
      id: slotId,
      playedCard,
      playedCardMode: playedCard ? cardModes[playedCard.id] : undefined,
      disabled: isBuyPhase || (hasPlayedThisTurn && !playedCard),
      onClear: () => onClearSlot(slotId),
      isExpandable: !playedCard,
      canReceiveSelection:
        !isBuyPhase &&
        selectedCardId !== undefined &&
        !(hasPlayedThisTurn && !playedCard),
      onSelectDestination: () => onSelectCardDestination?.(slotId),
    };
  }

  return (
    <div className='card-table flex flex-wrap justify-center items-center gap-2 my-4'>
      {/* Leading slot — insert before the first card */}
      <div className='px-1'>
        <CardActionSlot key={makeSlotId(0)} {...slotProps(makeSlotId(0))} />
      </div>

      {cards &&
        cards.length > 0 &&
        cards.map((card, index) => {
          const slotId = makeSlotId(index + 1);
          const isSelected = isBuyPhase && boughtCard?.id === card.id;

          return (
            <div className='flex items-center' key={card.id}>
              <div className='relative px-1'>
                <CodeTokenSlot
                  id={makeCardTokenId(card.id)}
                  token={placedTokens[card.id] ?? null}
                  onClear={() => onClearToken(card.id)}
                  selectedToken={selectedToken}
                  onSelectToken={onSelectToken}
                  onMoveToken={onMoveToken}
                />
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
                <CardActionSlot key={slotId} {...slotProps(slotId)} />
              </div>
            </div>
          );
        })}
    </div>
  );
}

