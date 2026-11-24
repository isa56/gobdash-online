import { useState } from 'react';
import { useNavigate } from 'react-router';
import type { Route } from './+types/home';
import { roomService } from '~/services/roomService';
import { useGameStore } from '~/store/gameStore';
import ToastComponent from '~/components/ui/ToastComponent';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'GobDash' },
    { name: 'description', content: 'Implementação On-line do jogo GobDash!' },
  ];
}

export default function Home() {
  const navigate = useNavigate();
  const [joinCode, setJoinCode] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const setPlayerId = useGameStore((state) => state.setPlayerId);

  async function handleCreateGame() {
    try {
      setIsCreating(true);
      setErrorMessage(null);
      const { roomId, playerId } = await roomService.createRoom();
      setPlayerId(playerId);
      navigate(`/game/${roomId}`);
    } catch (error: unknown) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to create room.');
    } finally {
      setIsCreating(false);
    }
  }

  async function handleJoinGame(e: React.FormEvent) {
    e.preventDefault();
    if (!joinCode.trim()) return;
    try {
      setIsJoining(true);
      setErrorMessage(null);
      const roomId = joinCode.trim();
      const { playerId } = await roomService.joinRoom(roomId);
      setPlayerId(playerId);
      navigate(`/game/${roomId}`);
    } catch (error: unknown) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to join room.');
    } finally {
      setIsJoining(false);
    }
  }

  return (
    <div className='flex flex-col items-center justify-center gap-4 w-full h-full max-w-md mx-auto p-4'>
      <h1 className='text-3xl font-bold font-emphasis text-sand-dune'>
        Welcome to GobDash!
      </h1>

      <p className='my-2 text-center text-white'>
        Online implementation of the{' '}
        <span className='font-titles drop-shadow-espresso-dark text-2xl text-fern-light'>
          GobDash
        </span>{' '}
        board game.
      </p>

      <p className='text-sm text-stone-300'>
        Check out the{' '}
        <a
          className='text-sunlit-clay underline hover:text-amber-300'
          href='https://isa56.itch.io/gobdash'
          target='_blank'
          rel='noopener noreferrer'>
          Itch.io page
        </a>
        .
      </p>

      <div className='flex flex-col items-center w-full gap-4 mt-6 bg-espresso/70 p-6 rounded-xl border border-stone-700 shadow-xl'>
        <button
          type='button'
          onClick={handleCreateGame}
          disabled={isCreating}
          className='w-full py-3 px-4 bg-fern hover:bg-fern-dark text-white font-bold rounded-lg transition-colors cursor-pointer disabled:opacity-50'>
          {isCreating ? 'Creating Room...' : 'Create Game'}
        </button>

        <div className='flex items-center gap-2 w-full my-2 text-stone-400'>
          <div className='flex-1 h-px bg-stone-600' />
          <span className='text-xs uppercase tracking-wider font-semibold'>Or join with code</span>
          <div className='flex-1 h-px bg-stone-600' />
        </div>

        <form onSubmit={handleJoinGame} className='flex flex-col w-full gap-3'>
          <input
            type='text'
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
            placeholder='Enter Room Code'
            className='w-full px-4 py-2 bg-stone-800 border border-stone-600 rounded-lg text-white placeholder-stone-400 text-center tracking-widest font-mono uppercase focus:outline-none focus:border-amber-400'
          />
          <button
            type='submit'
            disabled={!joinCode.trim() || isJoining}
            className='w-full py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed'>
            {isJoining ? 'Joining Room...' : 'Join Game'}
          </button>
        </form>
      </div>
      <div className='fixed bottom-4 right-4 z-50'>
        <ToastComponent
          text={errorMessage ?? ''}
          type='error'
          show={errorMessage !== null}
          onClose={() => setErrorMessage(null)}
        />
      </div>
    </div>
  );
}
