import { create } from 'zustand';
import type {
  BoardSpace,
  Card,
  DeckOfCards,
  PantryFood,
  Recipe,
} from '~/types/game';
import { socketService } from '~/services/socketService';
import type { ConnectionStatus, ServerGameStatePayload } from '~/types/server';
import {
  createDeck,
  generateRandomRecipe,
  getPreparedIngredient,
} from '~/types/constants';
import {
  ACTION_SLOT_PREFIX,
  CARD_TOKEN_PREFIX,
  DISCARD_SLOT_ID,
} from '~/lib/slots';
import type { CodeTokenType } from '~/components/game/cardTable/CodeToken';

export type TurnPhase = 'use' | 'buy';
export type BoughtSelection = { card: Card; source: 'table' | 'deck' } | null;
/** Tracks visual display mode per card id without mutating shared card instances. */
export type CardMode = 'normal' | 'staged' | 'discarded';

interface GameStore {
  // ── Connection ──────────────────────────────────────────────────────────────
  roomId: string | null;
  playerId: string | null;
  connectionStatus: ConnectionStatus;
  errorMessage: string | null;

  // ── Core game state ─────────────────────────────────────────────────────────
  hand: Card[];
  cardTableCards: Card[];
  discardPile: Card[];
  deckCount: number;
  playedCards: Record<string, Card>;
  /** Lookup map from card id → display mode. Never mutates card instances. */
  cardModes: Record<number, CardMode>;
  bought: BoughtSelection;
  placedTokens: Record<number, CodeTokenType>;
  draggingCard: Card | null;
  localDeck: DeckOfCards | null;
  gobSpace: BoardSpace;
  foodPositions: Record<number, BoardSpace>;
  foodTokens: PantryFood[];
  recipe: Recipe | null;
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
  moveGob: (space: BoardSpace) => void;
  moveFood: (foodId: number, space: BoardSpace) => void;
  addFood: (food: PantryFood) => void;
  prepareFood: (foodId: number) => void;

  // ── Server integration ───────────────────────────────────────────────────────
  setRoomId: (roomId: string) => void;
  setPlayerId: (playerId: string) => void;
  setNumberOfPlayers: (
    numberOfPlayers: number | ((current: number) => number),
  ) => void;
  setConnectionStatus: (status: ConnectionStatus) => void;
  setErrorMessage: (message: string | null) => void;
  /** Merge a partial game state received from the server. */
  applyServerState: (payload: ServerGameStatePayload) => void;
}

const initialGameState = {
  roomId: null,
  playerId: null,
  connectionStatus: 'disconnected' as ConnectionStatus,
  errorMessage: null as string | null,

  hand: [],
  cardTableCards: [],
  discardPile: [],
  deckCount: 0,
  playedCards: {},
  cardModes: {} as Record<number, CardMode>,
  bought: null,
  placedTokens: {},
  draggingCard: null,
  localDeck: null,
  gobSpace: 'salon' as BoardSpace,
  foodPositions: {} as Record<number, BoardSpace>,
  foodTokens: [] as PantryFood[],

  turnPhase: 'use' as TurnPhase,
  turnNumber: 1,
  numberOfPlayers: 4,
  mounted: false,
  recipe: null,
};

export const useGameStore = create<GameStore>()((set, get) => ({
  // ── Defaults ────────────────────────────────────────────────────────────────
  ...initialGameState,

  // ── Local game init ──────────────────────────────────────────────────────────
  initLocalGame: () => {
    // Guard prevents double-deal in React StrictMode (effects run twice in dev).
    if (get().mounted) return;
    const deck = createDeck();
    const recipe = generateRandomRecipe();
    set({
      localDeck: deck,
      hand: deck.dealCards(5),
      cardTableCards: deck.dealCards(5),
      deckCount: deck.cards.length,
      mounted: true,
      recipe: recipe,
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
    const newMode: CardMode =
      targetId === DISCARD_SLOT_ID ? 'discarded' : 'staged';

    set((state) => ({
      hand: existingCard
        ? [...state.hand.filter((c) => c.id !== card.id), existingCard]
        : state.hand.filter((c) => c.id !== card.id),
      playedCards: { ...state.playedCards, [targetId]: card },
      cardModes: {
        ...state.cardModes,
        ...(existingCard ? { [existingCard.id]: 'normal' as const } : {}),
        [card.id]: newMode,
      },
    }));
  },

  handleClearSlot: (slotId) => {
    const card = get().playedCards[slotId];
    if (!card) return;
    set((state) => {
      const next = { ...state.playedCards };
      delete next[slotId];
      const nextModes = { ...state.cardModes };
      delete nextModes[card.id];
      return {
        hand: [...state.hand, card],
        playedCards: next,
        cardModes: nextModes,
      };
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
        cardModes: {},
        turnPhase: 'buy',
      }));
    } else {
      const slotIndex = parseInt(
        slotId.replace(`${ACTION_SLOT_PREFIX}-`, ''),
        10,
      );
      set((state) => {
        const next = [...state.cardTableCards];
        next.splice(slotIndex, 0, card);
        return {
          cardTableCards: next,
          playedCards: {},
          cardModes: {},
          turnPhase: 'buy',
        };
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
      bought:
        state.bought?.source === 'deck'
          ? null
          : { card: topCard, source: 'deck' },
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
        cardTableCards: state.cardTableCards.filter(
          (c) => c.id !== bought.card.id,
        ),
        hand: [...state.hand, bought.card],
        bought: null,
        turnPhase: 'use',
        turnNumber: state.turnNumber + 1,
      }));
    }
  },

  handleTokenDrop: (targetId, token) => {
    if (!targetId.startsWith(CARD_TOKEN_PREFIX)) return;
    const cardId = Number(targetId.slice(`${CARD_TOKEN_PREFIX}-`.length));
    if (!Number.isInteger(cardId)) return;

    set((state) => {
      const next = Object.fromEntries(
        Object.entries(state.placedTokens).filter(
          ([, value]) => value !== token,
        ),
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

  moveGob: (space) => {
    set({ gobSpace: space });
    socketService.send({ type: 'MOVE_GOB', space });
  },

  moveFood: (foodId, space) => {
    set((state) => ({
      foodPositions: { ...state.foodPositions, [foodId]: space },
    }));
    socketService.send({ type: 'MOVE_FOOD', foodId, space });
  },

  addFood: (food) => {
    set((state) => ({
      foodTokens: [...state.foodTokens, food],
      foodPositions: { ...state.foodPositions, [food.id]: 'pantry' },
    }));
    socketService.send({ type: 'ADD_FOOD', food });
  },

  prepareFood: (foodId) => {
    const token = get().foodTokens.find((item) => item.id === foodId);
    if (!token) return;

    const preparedFood = getPreparedIngredient(token.food);
    if (!preparedFood) return;

    const preparedToken = { id: foodId, food: preparedFood };
    set((state) => ({
      foodTokens: state.foodTokens.map((item) =>
        item.id === foodId ? preparedToken : item,
      ),
    }));
    socketService.send({
      type: 'PREPARE_FOOD',
      foodId,
      food: preparedToken,
    });
  },

  // ── Server integration ───────────────────────────────────────────────────────
  setRoomId: (roomId) => set({ roomId }),
  setPlayerId: (playerId) => set({ playerId }),
  setNumberOfPlayers: (numberOfPlayers) =>
    set((state) => ({
      numberOfPlayers:
        typeof numberOfPlayers === 'function'
          ? numberOfPlayers(state.numberOfPlayers)
          : numberOfPlayers,
    })),
  setConnectionStatus: (connectionStatus) => set({ connectionStatus }),
  setErrorMessage: (errorMessage) => set({ errorMessage }),
  applyServerState: (payload) => set(payload),
}));
