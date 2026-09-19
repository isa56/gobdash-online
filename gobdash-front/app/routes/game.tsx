import { useState, useEffect } from 'react';
import { DragDropProvider } from '@dnd-kit/react';
import type { Route } from './+types/home';
import { deckOfCards } from '~/types/constants';
import type { Card as CardModel } from '~/types/game';
import ActionSlot, {
  ACTION_SLOT_PREFIX,
  DISCARD_SLOT_ID,
} from '~/components/ActionSlot';
import LoadingSpinner from '~/components/utils/LoadingSpinner';
import PlayerHand from '~/components/PlayerHand';
import RoomInfo from '~/components/RoomInfo';
import CardTable from '~/components/CardTable';
import CardDeck from '~/components/CardDeck';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Playing GobDash' },
    { name: 'description', content: 'Game' },
  ];
}

type TurnPhase = 'use' | 'buy';
type BoughtSelection = { card: CardModel; source: 'table' | 'deck' } | null;

export default function Game() {
  const roomId = '1234';
  const numberOfPlayers = 4;

  // ── Core game state ────────────────────────────────────────────────────────
  // Start empty — all dealing happens in useEffect (client-only) to prevent
  // React StrictMode's double-invocation from over-depleting the singleton deck.
  const [hand, setHand] = useState<CardModel[]>([]);
  const [cardTableCards, setCardTableCards] = useState<CardModel[]>([]);
  const [discardPile, setDiscardPile] = useState<CardModel[]>([]);

  // ── Turn flow ──────────────────────────────────────────────────────────────
  const [playedCards, setPlayedCards] = useState<Record<string, CardModel>>({});
  const [turnPhase, setTurnPhase] = useState<TurnPhase>('use');
  const [bought, setBought] = useState<BoughtSelection>(null);
  const [deckCount, setDeckCount] = useState(0);

  // ── UI state ───────────────────────────────────────────────────────────────
  const [draggingCard, setDraggingCard] = useState<CardModel | null>(null);
  const [turnNumber, setTurnNumber] = useState(1);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // All dealing happens here — runs exactly once on the client.
    setHand(deckOfCards.dealCards(5));
    setCardTableCards(deckOfCards.dealCards(5));
    setDeckCount(deckOfCards.cards.length);
    setMounted(true);
  }, []);

  // ── Phase 1 helpers ────────────────────────────────────────────────────────

  /** Return a staged card from an ActionSlot/DiscardPile back to hand. */
  function handleClearSlot(slotId: string) {
    const card = playedCards[slotId];
    if (!card) return;
    setHand((prev) => [...prev, card]);
    setPlayedCards((prev) => {
      const next = { ...prev };
      delete next[slotId];
      return next;
    });
  }

  /**
   * Commit the staged card:
   * – DiscardPile  → push to discardPile
   * – ActionSlot-N → insert at index N in cardTableCards
   * Then advance to buy phase.
   */
  function handleConfirmUse() {
    const entries = Object.entries(playedCards);
    if (entries.length === 0) return;

    const [slotId, card] = entries[0];

    if (slotId === DISCARD_SLOT_ID) {
      setDiscardPile((prev) => [...prev, card]);
    } else {
      const slotIndex = parseInt(
        slotId.replace(`${ACTION_SLOT_PREFIX}-`, ''),
        10,
      );
      setCardTableCards((prev) => {
        const next = [...prev];
        next.splice(slotIndex, 0, card);
        return next;
      });
    }

    setPlayedCards({});
    setTurnPhase('buy');
  }

  // ── Phase 2 helpers ────────────────────────────────────────────────────────

  /** Toggle buy selection for a table card. */
  function handleSelectBuyFromTable(card: CardModel) {
    setBought((prev) =>
      prev?.card.id === card.id && prev.source === 'table'
        ? null
        : { card, source: 'table' },
    );
  }

  /** Toggle buy selection for the deck (top card). */
  function handleSelectBuyFromDeck() {
    const topCard = deckOfCards.cards[0];
    if (!topCard) return; // deck is empty
    setBought((prev) =>
      prev?.source === 'deck' ? null : { card: topCard, source: 'deck' },
    );
  }

  /**
   * Commit the buy:
   * – deck  → deal 1 card, add to hand, update deckCount
   * – table → remove from cardTableCards, add to hand
   * Then reset to use phase and advance turn.
   */
  function handleConfirmBuy() {
    if (!bought) return;

    if (bought.source === 'deck') {
      const dealt = deckOfCards.dealCards(1);
      const dealtCard = dealt[0];
      if (!dealtCard) return; // deck ran out — shouldn't happen but guard
      setHand((prev) => [...prev, dealtCard]);
      setDeckCount(deckOfCards.cards.length);
    } else {
      setCardTableCards((prev) => prev.filter((c) => c.id !== bought.card.id));
      setHand((prev) => [...prev, bought.card]);
    }

    setBought(null);
    setTurnPhase('use');
    setTurnNumber((prev) => prev + 1);
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  if (!mounted) {
    return (
      <>
        <LoadingSpinner />
      </>
    );
  }

  const hasStaged = Object.keys(playedCards).length > 0;

  return (
    <div className='flex flex-col items-center justify-center gap-4 w-full h-full pb-8'>
      <DragDropProvider
        onDragStart={(event) => {
          if (turnPhase === 'buy') return; // locked during buy phase
          const card = event.operation.source?.data?.card as CardModel | undefined;
          setDraggingCard(card ?? null);
        }}
        onDragEnd={(event) => {
          setDraggingCard(null);
          if (event.canceled || turnPhase === 'buy') return;

          const targetId = event.operation.target?.id as string | undefined;
          const droppedOnSlot =
            targetId?.startsWith(ACTION_SLOT_PREFIX) ||
            targetId === DISCARD_SLOT_ID;
          if (!droppedOnSlot || !targetId) return;

          const card = event.operation.source?.data?.card as CardModel | undefined;
          if (!card) return;

          // If another slot was already filled this turn, reject the drop
          if (hasStaged && !playedCards[targetId]) return;

          // If this slot already had a card, return it to hand first
          const existingCard = playedCards[targetId];
          setHand((prev) => {
            const next = prev.filter((c) => c.id !== card.id);
            return existingCard ? [...next, existingCard] : next;
          });
          setPlayedCards((prev) => ({ ...prev, [targetId]: card }));
        }}>
        {/* Room Information */}
        <div className='flex flex-col items-end justify-end w-full'>
          <RoomInfo
            roomNumber={parseInt(roomId)}
            numberOfPlayers={numberOfPlayers}
            turnNumber={turnNumber}
          />
        </div>

        {/* Turn phase indicator */}
        <div className='flex items-center gap-3 text-sm'>
          <span
            className={
              turnPhase === 'use'
                ? 'text-amber-400 font-bold'
                : 'text-stone-500'
            }>
            1. Use a card
          </span>
          <span className='text-stone-600'>→</span>
          <span
            className={
              turnPhase === 'buy'
                ? 'text-amber-400 font-bold'
                : 'text-stone-500'
            }>
            2. Buy a card
          </span>
        </div>

        {/* Card table + Buy deck */}
        <div className='flex items-center gap-6 mt-4 mb-4'>
          <CardTable
            cards={cardTableCards}
            playedCards={playedCards}
            onClearSlot={handleClearSlot}
            turnPhase={turnPhase}
            boughtCard={bought?.source === 'table' ? bought.card : null}
            onBuyCard={handleSelectBuyFromTable}
          />

          <CardDeck
            deckCount={deckCount}
            turnPhase={turnPhase}
            isSelected={bought?.source === 'deck'}
            onSelect={handleSelectBuyFromDeck}
          />
        </div>

        {/* Player hand (includes Discard Pile) */}
        <PlayerHand
          hand={hand}
          draggingCard={draggingCard}
          discardPile={discardPile}
          stagedDiscardCard={playedCards[DISCARD_SLOT_ID] ?? null}
          discardDisabled={hasStaged && !playedCards[DISCARD_SLOT_ID]}
          onClearStagedDiscard={() => handleClearSlot(DISCARD_SLOT_ID)}
          turnPhase={turnPhase}
        />

        {/* Phase-aware action button */}
        <div className='flex justify-center'>
          {turnPhase === 'use' ? (
            <button
              type='button'
              disabled={!hasStaged}
              className='cursor-pointer px-6 py-2 bg-amber-500 text-white font-semibold rounded hover:bg-amber-600 transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-amber-500'
              onClick={handleConfirmUse}>
              Confirm Use →
            </button>
          ) : (
            <button
              type='button'
              disabled={bought === null}
              className='cursor-pointer px-6 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-blue-500'
              onClick={handleConfirmBuy}>
              Confirm Buy ✓
            </button>
          )}
        </div>
      </DragDropProvider>
    </div>
  );
}
