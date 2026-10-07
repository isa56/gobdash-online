import { useEffect } from 'react';
import { useParams } from 'react-router';
import { DragDropProvider, DragOverlay } from '@dnd-kit/react';
import type { Route } from './+types/game';
import type { Card as CardModel } from '~/types/game';
import { ACTION_SLOT_PREFIX, DISCARD_SLOT_ID } from '~/lib/slots';
import { CARD_TOKEN_PREFIX } from '~/lib/slots';
import LoadingSpinner from '~/components/ui/LoadingSpinner';
import PlayerHand from '~/components/game/PlayerHand';
import RoomInfo from '~/components/room/RoomInfo';
import CardTable from '~/components/game/CardTable';
import CardDeck from '~/components/game/CardDeck';
import DiscardPile from '~/components/game/DiscardPile';
import { useGameState } from '~/hooks/useGameState';
import { useRoom } from '~/hooks/useRoom';
import PhaseButton from '~/components/game/PhaseButton';
import CodeTokenContainer from '~/components/game/CodeTokenContainer';
import Card from '~/components/game/Card';
import type { CodeTokenType } from '~/components/game/CodeToken';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Playing GobDash' },
    { name: 'description', content: 'Game' },
  ];
}

export default function Game() {
  const params = useParams();
  const roomId = params.roomId || '1234';

  // Room / WebSocket connection lifecycle
  useRoom(roomId);

  // Global game state & actions from store
  const {
    hand,
    cardTableCards,
    discardPile,
    deckCount,
    playedCards,
    bought,
    placedTokens,
    draggingCard,
    turnPhase,
    turnNumber,
    numberOfPlayers,
    mounted,
    initLocalGame,
    resetGame,
    setDraggingCard,
    handleDrop,
    handleClearSlot,
    handleConfirmUse,
    handleSelectBuyFromTable,
    handleSelectBuyFromDeck,
    handleConfirmBuy,
    handleTokenDrop,
    handleClearToken,
  } = useGameState();

  useEffect(() => {
    initLocalGame();
    return () => {
      resetGame();
    };
  }, [initLocalGame, resetGame, roomId]);

  if (!mounted) {
    return <LoadingSpinner />;
  }

  const hasStaged = Object.keys(playedCards).length > 0;

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

          const token = event.operation.source?.data?.type as
            | CodeTokenType
            | undefined;
          const isCodeToken = token === 'program' || token === 'error';
          if (turnPhase === 'buy' && !isCodeToken) return;

          const targetId = event.operation.target?.id as string | undefined;
          const droppedOnSlot =
            targetId?.startsWith(ACTION_SLOT_PREFIX) ||
            targetId === DISCARD_SLOT_ID ||
            targetId?.startsWith(CARD_TOKEN_PREFIX);
          if (!droppedOnSlot || !targetId) return;

          if (targetId.startsWith(CARD_TOKEN_PREFIX)) {
            if (isCodeToken) {
              handleTokenDrop(targetId, token);
            }
            return;
          }

          const card = event.operation.source?.data?.card as
            CardModel | undefined;
          if (!card) return;

          handleDrop(targetId, card);
        }}>
        {/* Room Information */}
        <div className='flex flex-col items-end justify-end w-full'>
          <RoomInfo
            roomId={roomId}
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

        {/* Card table + Buy deck + Discard pile */}
        <div className='flex items-center justify-between gap-6 my-4 px-2 w-full'>
          <CardTable
            cards={cardTableCards}
            playedCards={playedCards}
            onClearSlot={handleClearSlot}
            turnPhase={turnPhase}
            boughtCard={bought?.source === 'table' ? bought.card : null}
            onBuyCard={handleSelectBuyFromTable}
            placedTokens={placedTokens}
            onClearToken={handleClearToken}
          />

          <div className='flex flex-col justify-center items-top gap-4 mr-4'>
            <CardDeck
              deckCount={deckCount}
              turnPhase={turnPhase}
              isSelected={bought?.source === 'deck'}
              onSelect={handleSelectBuyFromDeck}
            />

            <DiscardPile
              pile={discardPile}
              stagedCard={playedCards[DISCARD_SLOT_ID] ?? null}
              disabled={
                turnPhase === 'buy' ||
                (hasStaged && !playedCards[DISCARD_SLOT_ID])
              }
              onClearStaged={
                turnPhase === 'buy'
                  ? undefined
                  : () => handleClearSlot(DISCARD_SLOT_ID)
              }
            />
          </div>
        </div>

        <div className='flex items-center justify-evenly w-full mb-4'>
          {/* Code Token Container */}
          <CodeTokenContainer
            placedTokens={{
              program: Object.values(placedTokens).includes('program'),
              error: Object.values(placedTokens).includes('error'),
            }}
          />

          {/* Player hand */}
          <PlayerHand
            hand={hand}
            turnPhase={turnPhase}
          />

          {/* Map Button */}
          
        </div>

        {/* Keep the overlay outside flex layouts so it cannot affect their sizing. */}
        <DragOverlay>
          {turnPhase !== 'buy' && draggingCard ? (
            <div className='rotate-3 scale-110 drop-shadow-2xl'>
              <Card card={draggingCard} />
            </div>
          ) : null}
        </DragOverlay>

        {/* Phase-aware floating action button */}
        <PhaseButton
          turnPhase={turnPhase}
          hasStaged={hasStaged}
          handleConfirmUse={handleConfirmUse}
          handleConfirmBuy={handleConfirmBuy}
          bought={bought}
        />
      </DragDropProvider>
    </div>
  );
}

