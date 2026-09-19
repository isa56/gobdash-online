import { useState, useEffect } from 'react';
import { DragDropProvider, DragOverlay } from '@dnd-kit/react';
import type { Route } from './+types/home';
import { deckOfCards } from '~/types/constants';
import type { Card as CardModel } from '~/types/game';
import DraggableCard from '~/components/DraggableCard';
import ActionSlot, {
  ACTION_SLOT_PREFIX,
  DISCARD_SLOT_ID,
  makeSlotId,
} from '~/components/ActionSlot';
import LoadingSpinner from '~/components/utils/LoadingSpinner';
import PlayerHand from '~/components/PlayerHand';
import RoomInfo from '~/components/RoomInfo';
import CardTable from '~/components/CardTable';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Playing GobDash' },
    { name: 'description', content: 'Game' },
  ];
}

/** Fisher-Yates shuffle — returns a new array */
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function Game() {
  const roomId = '1234';

  // Start with a deterministic slice so the server and client first-render match.
  // The shuffle happens in useEffect (client-only) to avoid hydration mismatch.
  const [hand, setHand] = useState<CardModel[]>(deckOfCards.dealCards(5));
  const [cardTableCards, setCardTableCards] = useState<CardModel[]>(
    deckOfCards.dealCards(5),
  );
  const [playedCards, setPlayedCards] = useState<Record<string, CardModel>>({});
  const [draggingCard, setDraggingCard] = useState<CardModel | null>(null);
  const [mounted, setMounted] = useState(false);

  const [turnNumber, setTurnNumber] = useState(1);
  const [numberOfPlayers, setNumberOfPlayers] = useState(4);

  useEffect(() => {
    // Deal a fresh hand on the client only.
    // setHand(deckOfCards.dealCards(5));

    setCardTableCards(deckOfCards.dealCards(5));

    setMounted(true);
  }, []);

  function handleClearSlot(slotId: string) {
    const card = playedCards[slotId];
    if (card) {
      // Return the card to the end of the hand
      setHand((prev) => [...prev, card]);
      setPlayedCards((prev) => {
        const next = { ...prev };
        delete next[slotId];
        return next;
      });
    }
  }

  function handleConfirmTurn() {
    const entries = Object.entries(playedCards);
    if (entries.length === 0) return; // nothing played — do not advance

    const [slotId, card] = entries[0];

    if (slotId === DISCARD_SLOT_ID) {
      // Card goes to the discard pile — just remove it from the board
      setPlayedCards({});
      setTurnNumber((prev) => prev + 1);
      return;
    }

    // Slot ids are "action-slot-N". N is the insertion index into cardTableCards.
    const slotIndex = parseInt(slotId.replace(`${ACTION_SLOT_PREFIX}-`, ''), 10);

    setCardTableCards((prev) => {
      const next = [...prev];
      next.splice(slotIndex, 0, card);
      return next;
    });

    setPlayedCards({});
    setTurnNumber((prev) => prev + 1);
  }

  if (!mounted) {
    return (
      <>
        <LoadingSpinner />
      </>
    );
  }

  return (
    <div className='flex flex-col items-center justify-center gap-4 w-full h-full pb-8'>
      <DragDropProvider
        onDragStart={(event) => {
          const card = event.operation.source?.data?.card as
            CardModel | undefined;
          setDraggingCard(card ?? null);
        }}
        onDragEnd={(event) => {
          setDraggingCard(null);

          if (event.canceled) return;

          const targetId = event.operation.target?.id as string | undefined;
          const droppedOnSlot =
            targetId?.startsWith(ACTION_SLOT_PREFIX) ||
            targetId === DISCARD_SLOT_ID;
          if (!droppedOnSlot || !targetId) return;

          const card = event.operation.source?.data?.card as
            CardModel | undefined;
          if (!card) return;

          // If there was already a card in this slot, return it to the hand first
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

        {/* Action slot - drop target */}
        <div className='mt-8 mb-8'>
          <CardTable
            cards={cardTableCards}
            playedCards={playedCards}
            onClearSlot={handleClearSlot}
          />
        </div>

        {/* Player hand */}
        <PlayerHand hand={hand} draggingCard={draggingCard} />

        <div className='flex justify-center align-end'>
          <button
            type='button'
            disabled={Object.keys(playedCards).length === 0}
            className='cursor-pointer px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-blue-500'
            onClick={handleConfirmTurn}>
            Confirm Turn
          </button>
        </div>
      </DragDropProvider>
    </div>
  );
}
