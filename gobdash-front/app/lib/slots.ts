/** Prefix for all action-slot droppable IDs. */
export const ACTION_SLOT_PREFIX = 'action-slot';

/** Droppable ID for the discard pile slot. */
export const DISCARD_SLOT_ID = 'discard-slot';

/** Build a slot ID for position `index` in the card table. */
export function makeSlotId(index: number): string {
  return `${ACTION_SLOT_PREFIX}-${index}`;
}

