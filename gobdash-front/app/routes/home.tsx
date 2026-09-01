import { NavLink } from 'react-router';
import type { Route } from './+types/home';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'GobDash' },
    { name: 'description', content: 'Implementação On-line do jogo GobDash!' },
  ];
}

export default function Home() {
  return (
    <div className='flex flex-col items-center justify-center gap-4 w-full h-full'>
      <h1>Welcome to the Home Page!</h1>

      <p className='my-4'>
        This is the home page of the{' '}
        <span className='font-titles drop-shadow-espresso-dark text-2xl'>
          {' '}
          GobDash{' '}
        </span>{' '}
        game.
      </p>

      <p>
        Check out the{' '}
        <a
          className='text-sunlit-clay underline'
          href='https://isa56.itch.io/gobdash'
          target='_blank'
          rel='noopener noreferrer'>
          Itch.io page.
        </a>
      </p>

      <NavLink
        to='/game'
        className='my-4 bg-espresso p-3 rounded hover:bg-espresso-dark'>
        Look for game
      </NavLink>

      <p>Or</p>

      <NavLink
        to='/game'
        className='my-4 bg-fern p-3 rounded hover:bg-fern-dark'>
        Create game
      </NavLink>
    </div>
  );
}

