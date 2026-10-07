/** Prefix for all action-slot droppable IDs. */
export const ACTION_SLOT_PREFIX = 'action-slot';

/** Droppable ID for the discard pile slot. */
export const DISCARD_SLOT_ID = 'discard-slot';

/** Prefix for code-token spots attached to table cards. */
export const CARD_TOKEN_PREFIX = 'card-token';

/** Build the code-token spot ID for a table card. */
export function makeCardTokenId(cardId: number): string {
  return `${CARD_TOKEN_PREFIX}-${cardId}`;
}

/** Build a slot ID for position `index` in the card table. */
export function makeSlotId(index: number): string {
  return `${ACTION_SLOT_PREFIX}-${index}`;
}

