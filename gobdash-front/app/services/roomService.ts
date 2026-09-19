/**
 * Room management REST client.
 *
 * MOCK_MODE = true (default): all calls resolve locally with fake data.
 * Set MOCK_MODE = false and point API_BASE at a real server when ready.
 */

const MOCK_MODE = true;
const API_BASE = '/api';

export type CreateRoomResult = {
  roomId: string;
  playerId: string;
};

export type JoinRoomResult = {
  playerId: string;
};

function generateId(length = 6): string {
  return Math.random().toString(36).slice(2, 2 + length).toUpperCase();
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const roomService = {
  /** Create a new room and return its ID plus the local player's ID. */
  async createRoom(): Promise<CreateRoomResult> {
    if (MOCK_MODE) {
      await delay(200);
      console.info('[RoomService] 🏠 Mock createRoom');
      return { roomId: generateId(), playerId: `player-${generateId(4)}` };
    }
    const res = await fetch(`${API_BASE}/rooms`, { method: 'POST' });
    if (!res.ok) throw new Error(`createRoom failed: ${res.status}`);
    return res.json() as Promise<CreateRoomResult>;
  },

  /** Join an existing room by code and return the local player's ID. */
  async joinRoom(roomId: string): Promise<JoinRoomResult> {
    if (MOCK_MODE) {
      await delay(200);
      console.info(`[RoomService] 🚪 Mock joinRoom: ${roomId}`);
      return { playerId: `player-${generateId(4)}` };
    }
    const res = await fetch(`${API_BASE}/rooms/${roomId}/join`, { method: 'POST' });
    if (!res.ok) throw new Error(`joinRoom failed: ${res.status}`);
    return res.json() as Promise<JoinRoomResult>;
  },

  /** Notify the server that this player is leaving. */
  async leaveRoom(roomId: string, playerId: string): Promise<void> {
    if (MOCK_MODE) {
      await delay(50);
      console.info(`[RoomService] 👋 Mock leaveRoom: ${roomId}/${playerId}`);
      return;
    }
    await fetch(`${API_BASE}/rooms/${roomId}/leave`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ playerId }),
    });
  },
};

