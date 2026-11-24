import type { BoardSpace, Card, PantryFood } from './game';

// ── Connection ────────────────────────────────────────────────────────────────

export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

// ── Client → Server events ────────────────────────────────────────────────────

export type ClientEvent =
  | { type: 'JOIN_ROOM'; roomId: string; playerId: string }
  | { type: 'USE_CARD'; slotId: string; cardId: number }
  | { type: 'BUY_CARD'; source: 'table' | 'deck'; cardId: number }
  | { type: 'CONFIRM_BUY' }
  | { type: 'MOVE_GOB'; space: BoardSpace }
  | { type: 'MOVE_FOOD'; foodId: number; space: BoardSpace }
  | { type: 'ADD_FOOD'; food: PantryFood }
  | { type: 'PREPARE_FOOD'; foodId: number; food: PantryFood };

// ── Server → Client events ────────────────────────────────────────────────────

/**
 * Partial game state sent by the server on any state change.
 * Fields are optional — the server only sends what changed.
 */
export type ServerGameStatePayload = {
  hand?: Card[];
  cardTableCards?: Card[];
  discardPile?: Card[];
  deckCount?: number;
  turnPhase?: 'use' | 'buy';
  turnNumber?: number;
  numberOfPlayers?: number;
  gobSpace?: BoardSpace;
  foodPositions?: Record<number, BoardSpace>;
  foodTokens?: PantryFood[];
};

export type ServerEvent =
  | { type: 'GAME_STATE_UPDATE'; payload: ServerGameStatePayload }
  | { type: 'PLAYER_JOINED'; playerId: string }
  | { type: 'PLAYER_LEFT'; playerId: string }
  | { type: 'ERROR'; message: string };

