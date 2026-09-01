import type { Route } from './+types/home';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Playing GobDash' },
    { name: 'description', content: 'Game' },
  ];
}

export default function Game() {
  const roomId = '1234'; // This should be dynamically set based on the route parameters

  const numberOfPlayers = 4; // This should be dynamically set based on the game state

  return (
    <>
      <h1>Room: {roomId}</h1>
      <p>Numer of Players: {numberOfPlayers}</p>

      
    </>
  );
}
