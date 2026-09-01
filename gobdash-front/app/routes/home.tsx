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
    <>
      <h1>Welcome to the Home Page</h1>

      <p>This is the home page of the GobDash game.</p>

      <NavLink to="/game">Look for game</NavLink>

      <p>Or</p>

      <NavLink to="/game">Create game</NavLink>
    </>
  );
}
