import { useEffect } from 'react';
import { useParams } from 'react-router';
import { DragDropProvider, DragOverlay } from '@dnd-kit/react';
import type { Route } from './+types/game2';
import type { Card as CardModel } from '~/types/game';
import { ACTION_SLOT_PREFIX, DISCARD_SLOT_ID } from '~/lib/slots';
import { CARD_TOKEN_PREFIX } from '~/lib/slots';
import LoadingSpinner from '~/components/ui/LoadingSpinner';
import PlayerHand from '~/components/game/cardTable/PlayerHand';
import RoomInfo from '~/components/room/RoomInfo';
import CardTable from '~/components/game/cardTable/CardTable';
import CardDeck from '~/components/game/cardTable/CardDeck';
import DiscardPile from '~/components/game/cardTable/DiscardPile';
import { useGameState } from '~/hooks/useGameState';
import { useRoom } from '~/hooks/useRoom';
import PhaseButton from '~/components/game/cardTable/PhaseButton';
import CodeTokenContainer from '~/components/game/cardTable/CodeTokenContainer';
import Card from '~/components/game/cardTable/Card';
import type { CodeTokenType } from '~/components/game/cardTable/CodeToken';
import Board from '~/components/game/board/Board';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Playing GobDash' },
    { name: 'description', content: 'Game' },
  ];
}

export default function Game() {
  const params = useParams();
  const roomId = params.roomId || '123456';

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
    // flex flex-col

    <div className='pb-12 w-full'>
      {/* Header */}
      <div>
        {/* Room Information */}
        <div className='flex flex-col items-end justify-end w-full mb-2'>
          <RoomInfo
            roomId={roomId}
            numberOfPlayers={numberOfPlayers}
            turnNumber={turnNumber}
            turnPhase={turnPhase}
          />
        </div>
      </div>

      <div className='grid grid-cols-3 gap-2 mx-1'>
        {/* Card Table */}
        <div className='col-span-2'>
          {/* Card Deck + Discard Pile */}
          <div className='flex justify-center items-top gap-4 mb-2'>
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
                CodeTokenType | undefined;
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
            {/* Card table */}
            <div className='flex items-center justify-center gap-6 my-4 px-2 w-full'>
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
            </div>

            {/* Player Controls: Code Tokens Tray & Player Hand */}
            <div className='flex items-center justify-center gap-6 lg:gap-8 w-full mt-6 mb-4 px-2'>
              {/* Code Token Tray */}
              <div className='flex flex-col items-center justify-center p-3 rounded-2xl bg-stone-900/60 border border-stone-800/80 shadow-md backdrop-blur-xs shrink-0 min-w-[140px]'>
                <p className='text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2'>
                  Tokens
                </p>
                <CodeTokenContainer
                  placedTokens={{
                    program: Object.values(placedTokens).includes('program'),
                    error: Object.values(placedTokens).includes('error'),
                  }}
                />
              </div>

              {/* Player Hand */}
              <div className='shrink-0'>
                <PlayerHand hand={hand} turnPhase={turnPhase} />
              </div>
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

        {/* Board */}
        <div className='rounded-2xl overflow-hidden border border-stone-800/80 shadow-2xl'>
          <Board />
        </div>
        {/* </div> */}
      </div>
    </div>
  );
}
