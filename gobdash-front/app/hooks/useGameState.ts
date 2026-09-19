import { useGameStore } from '~/store/gameStore';

/**
 * Returns all game state and actions from the Zustand store.
 * Import this in route components to keep them uncluttered.
 */
export function useGameState() {
  return useGameStore();
}

