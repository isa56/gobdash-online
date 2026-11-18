import { useEffect } from 'react';
import { useParams } from 'react-router';
import type { Route } from './+types/game';
import LoadingSpinner from '~/components/ui/LoadingSpinner';
import RoomInfo from '~/components/room/RoomInfo';
import { useGameState } from '~/hooks/useGameState';
import { useRoom } from '~/hooks/useRoom';
import Board from '~/components/game/Board';
import CardAndHand from '~/components/game/CardHand';

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

  // Page-level game state used by the room header and lifecycle
  const {
    turnPhase,
    turnNumber,
    numberOfPlayers,
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

  if (!mounted) {
    return <LoadingSpinner />;
  }

  return (
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
          <CardAndHand />
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
