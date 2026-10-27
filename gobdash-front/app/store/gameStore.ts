import { create } from 'zustand';
import type { Card, DeckOfCards } from '~/types/game';
import type { ConnectionStatus, ServerGameStatePayload } from '~/types/server';
import { createDeck } from '~/types/constants';
import {
  ACTION_SLOT_PREFIX,
  CARD_TOKEN_PREFIX,
  DISCARD_SLOT_ID,
} from '~/lib/slots';
import type { CodeTokenType } from '~/components/game/cardTable/CodeToken';

export type TurnPhase = 'use' | 'buy';
export type BoughtSelection = { card: Card; source: 'table' | 'deck' } | null;

interface GameStore {
  // ── Connection ──────────────────────────────────────────────────────────────
  roomId: string | null;
  playerId: string | null;
  connectionStatus: ConnectionStatus;

  // ── Core game state ─────────────────────────────────────────────────────────
  hand: Card[];
  cardTableCards: Card[];
  discardPile: Card[];
  deckCount: number;
  playedCards: Record<string, Card>;
  bought: BoughtSelection;
  placedTokens: Record<number, CodeTokenType>;
  draggingCard: Card | null;
  localDeck: DeckOfCards | null;

  // ── Turn flow ────────────────────────────────────────────────────────────────
  turnPhase: TurnPhase;
  turnNumber: number;
  numberOfPlayers: number;
  mounted: boolean;

  // ── Local actions ────────────────────────────────────────────────────────────
  /**
   * Deal the initial hand and table cards from the local deck.
   * Guarded by `mounted` so StrictMode's double-invocation is harmless.
   */
  initLocalGame: () => void;
  /** Reset game and room state back to initial defaults. */
  resetGame: () => void;
  setDraggingCard: (card: Card | null) => void;
  /** Process a successful drag-drop onto a slot. */
  handleDrop: (targetId: string, card: Card) => void;
  /** Return a staged card from a slot back to hand. */
  handleClearSlot: (slotId: string) => void;
  /** Commit the staged card and advance to the buy phase. */
  handleConfirmUse: () => void;
  /** Toggle buy selection for a card on the table. */
  handleSelectBuyFromTable: (card: Card) => void;
  /** Toggle buy selection for the top of the draw deck. */
  handleSelectBuyFromDeck: () => void;
  /** Commit the buy and advance to the next turn. */
  handleConfirmBuy: () => void;
  handleTokenDrop: (targetId: string, token: CodeTokenType) => void;
  handleClearToken: (cardId: number) => void;

  // ── Server integration ───────────────────────────────────────────────────────
  setRoomId: (roomId: string) => void;
  setPlayerId: (playerId: string) => void;
  setConnectionStatus: (status: ConnectionStatus) => void;
  /** Merge a partial game state received from the server. */
  applyServerState: (payload: ServerGameStatePayload) => void;
}

const initialGameState = {
  roomId: null,
  playerId: null,
  connectionStatus: 'disconnected' as ConnectionStatus,

  hand: [],
  cardTableCards: [],
  discardPile: [],
  deckCount: 0,
  playedCards: {},
  bought: null,
  placedTokens: {},
  draggingCard: null,
  localDeck: null,

  turnPhase: 'use' as TurnPhase,
  turnNumber: 1,
  numberOfPlayers: 4,
  mounted: false,
};

export const useGameStore = create<GameStore>()((set, get) => ({
  // ── Defaults ────────────────────────────────────────────────────────────────
  ...initialGameState,

  // ── Local game init ──────────────────────────────────────────────────────────
  initLocalGame: () => {
    // Guard prevents double-deal in React StrictMode (effects run twice in dev).
    if (get().mounted) return;
    const deck = createDeck();
    set({
      localDeck: deck,
      hand: deck.dealCards(5),
      cardTableCards: deck.dealCards(5),
      deckCount: deck.cards.length,
      mounted: true,
    });
  },

  resetGame: () => {
    set(initialGameState);
  },

  // ── UI actions ───────────────────────────────────────────────────────────────
  setDraggingCard: (card) => set({ draggingCard: card }),

  handleDrop: (targetId, card) => {
    const { playedCards } = get();
    const hasStaged = Object.keys(playedCards).length > 0;
    // Reject drop if a different slot is already filled this turn
    if (hasStaged && !playedCards[targetId]) return;

    const existingCard = playedCards[targetId];
    set((state) => ({
      hand: existingCard
        ? [...state.hand.filter((c) => c.id !== card.id), existingCard]
        : state.hand.filter((c) => c.id !== card.id),
      playedCards: { ...state.playedCards, [targetId]: card },
    }));
  },

  handleClearSlot: (slotId) => {
    const card = get().playedCards[slotId];
    if (!card) return;
    set((state) => {
      const next = { ...state.playedCards };
      delete next[slotId];
      return { hand: [...state.hand, card], playedCards: next };
    });
  },

  handleConfirmUse: () => {
    const entries = Object.entries(get().playedCards);
    if (entries.length === 0) return;

    const [slotId, card] = entries[0];

    if (slotId === DISCARD_SLOT_ID) {
      set((state) => ({
        discardPile: [...state.discardPile, card],
        playedCards: {},
        turnPhase: 'buy',
      }));
    } else {
      const slotIndex = parseInt(slotId.replace(`${ACTION_SLOT_PREFIX}-`, ''), 10);
      set((state) => {
        const next = [...state.cardTableCards];
        next.splice(slotIndex, 0, card);
        return { cardTableCards: next, playedCards: {}, turnPhase: 'buy' };
      });
    }
  },

  handleSelectBuyFromTable: (card) => {
    set((state) => ({
      bought:
        state.bought?.card.id === card.id && state.bought.source === 'table'
          ? null
          : { card, source: 'table' },
    }));
  },

  handleSelectBuyFromDeck: () => {
    const topCard = get().localDeck?.cards[0];
    if (!topCard) return; // deck empty
    set((state) => ({
      bought: state.bought?.source === 'deck' ? null : { card: topCard, source: 'deck' },
    }));
  },

  handleConfirmBuy: () => {
    const { bought, localDeck } = get();
    if (!bought) return;

    if (bought.source === 'deck') {
      if (!localDeck) return;
      const [dealtCard] = localDeck.dealCards(1);
      if (!dealtCard) return; // deck ran out
      set((state) => ({
        hand: [...state.hand, dealtCard],
        deckCount: localDeck.cards.length,
        bought: null,
        turnPhase: 'use',
        turnNumber: state.turnNumber + 1,
      }));
    } else {
      set((state) => ({
        cardTableCards: state.cardTableCards.filter((c) => c.id !== bought.card.id),
        hand: [...state.hand, bought.card],
        bought: null,
        turnPhase: 'use',
        turnNumber: state.turnNumber + 1,
      }));
    }
  },

  handleTokenDrop: (targetId, token) => {
    if (!targetId.startsWith(CARD_TOKEN_PREFIX)) return;
    const cardId = Number(
      targetId.slice(`${CARD_TOKEN_PREFIX}-`.length),
    );
    if (!Number.isInteger(cardId)) return;

    set((state) => {
      const next = Object.fromEntries(
        Object.entries(state.placedTokens).filter(([, value]) => value !== token),
      ) as Record<number, CodeTokenType>;
      next[cardId] = token;
      return { placedTokens: next };
    });
  },

  handleClearToken: (cardId) => {
    set((state) => {
      const next = { ...state.placedTokens };
      delete next[cardId];
      return { placedTokens: next };
    });
  },

  // ── Server integration ───────────────────────────────────────────────────────
  setRoomId: (roomId) => set({ roomId }),
  setPlayerId: (playerId) => set({ playerId }),
  setConnectionStatus: (connectionStatus) => set({ connectionStatus }),
  applyServerState: (payload) => set(payload),
}));

