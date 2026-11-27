import { useEffect } from 'react';
import { useParams } from 'react-router';
import type { Route } from './+types/game';
import LoadingSpinner from '~/components/ui/LoadingSpinner';
import RoomInfo from '~/components/room/RoomInfo';
import { useGameState } from '~/hooks/useGameState';
import { useRoom } from '~/hooks/useRoom';
import Board from '~/components/game/Board';
import CardHand from '~/components/game/CardHand';
import ToastComponent from '~/components/ui/ToastComponent';
import { useLanguage } from '~/lib/i18n';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Playing GobDash' },
    { name: 'description', content: 'Game' },
  ];
}

export default function Game() {
  const { language, t } = useLanguage();
  const params = useParams();
  const roomId = params.roomId || '123456';

  // Room / WebSocket connection lifecycle
  useRoom(roomId);

  // Page-level game state used by the room header and lifecycle
  const {
    turnPhase,
    turnNumber,
    numberOfPlayers,
    connectionStatus,
    errorMessage,
    setErrorMessage,
    mounted,
    initLocalGame,
    resetGame,
  } = useGameState();

  useEffect(() => {
    initLocalGame();
    return () => {
      resetGame();
    };
  }, [initLocalGame, resetGame, roomId]);

  useEffect(() => {
    document.title = t('playingGobDash');
  }, [language, t]);

  if (!mounted) {
    return <LoadingSpinner />;
  }

  return (
    <div className='pb-12 w-full'>
      <div className='fixed bottom-4 right-4 z-50'>
        <ToastComponent
          text={
            errorMessage ??
            (connectionStatus === 'error'
              ? t('connectionFailed')
              : '')
          }
          type='error'
          show={errorMessage !== null || connectionStatus === 'error'}
          onClose={() => setErrorMessage(null)}
        />
      </div>
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

      <div className='grid grid-cols-3 items-start gap-2 mx-1'>
        {/* Card Table */}
        <div className='col-span-2'>
          <CardHand />
        </div>

        {/* Board */}
        <div className='aspect-[1203/1600] w-full overflow-hidden rounded-2xl border border-stone-800/80 shadow-2xl'>
          <Board />
        </div>
      </div>
    </div>
  );
}
