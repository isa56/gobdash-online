import { useState, useEffect } from 'react';
import { DragDropProvider, DragOverlay } from '@dnd-kit/react';
import type { Route } from './+types/home';
import { deckOfCards } from '~/types/constants';
import type { Card as CardModel } from '~/types/game';
import DraggableCard from '~/components/DraggableCard';
import ActionSlot, { ACTION_SLOT_ID } from '~/components/ActionSlot';
import Card from '~/components/Card';
import LoadingSpinner from '~/components/LoadingSpinner';

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
  const numberOfPlayers = 4;

  // Start with a deterministic slice so the server and client first-render match.
  // The shuffle happens in useEffect (client-only) to avoid hydration mismatch.
  const [hand, setHand] = useState<CardModel[]>(deckOfCards.slice(0, 4));
  const [playedCard, setPlayedCard] = useState<CardModel | null>(null);
  const [draggingCard, setDraggingCard] = useState<CardModel | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Shuffle the deck and deal a fresh hand on the client only.
    setHand(shuffle(deckOfCards).slice(0, 5));
    setMounted(true);
  }, []);

  function handleClearSlot() {
    if (playedCard) {
      // Return the card to the end of the hand
      setHand((prev) => [...prev, playedCard]);
      setPlayedCard(null);
    }
  }

  if (!mounted) {
    return (
      <>
        <LoadingSpinner />
      </>
    );
  }

  return (
    <DragDropProvider
      onDragStart={(event) => {
        const card = event.operation.source?.data?.card as
          CardModel | undefined;
        setDraggingCard(card ?? null);
      }}
      onDragEnd={(event) => {
        setDraggingCard(null);

        if (event.canceled) return;

        const droppedOnSlot = event.operation.target?.id === ACTION_SLOT_ID;
        if (!droppedOnSlot) return;

        const card = event.operation.source?.data?.card as
          CardModel | undefined;
        if (!card) return;

        // If there was already a played card, return it to the hand first
        setHand((prev) => {
          const next = prev.filter((c) => c.id !== card.id);
          return playedCard ? [...next, playedCard] : next;
        });
        setPlayedCard(card);
      }}>
      <h1>Room: {roomId}</h1>
      <p>Number of Players: {numberOfPlayers}</p>

      {/* Action slot - drop target */}
      <div className='mt-8 mb-8'>
        <p className='mb-2 text-sm text-center font-semibold uppercase tracking-widest text-stone-400'>
          Your Action
        </p>
        <ActionSlot playedCard={playedCard} onClear={handleClearSlot} />
      </div>

      {/* Player hand */}
      <div className='flex flex-col gap-2'>
        <p className='text-sm font-semibold uppercase tracking-widest text-stone-400'>
          Hand
        </p>
        <div className='flex gap-4'>
          {hand.map((card) => (
            <DraggableCard key={card.id} card={card} />
          ))}
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
    </DragDropProvider>
  );
}

