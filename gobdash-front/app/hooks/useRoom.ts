import { useEffect } from 'react';
import { useGameStore } from '~/store/gameStore';
import { socketService } from '~/services/socketService';
import { roomService } from '~/services/roomService';
import type { ConnectionStatus, ServerEvent } from '~/types/server';

/**
 * Manages the WebSocket connection lifecycle for a room.
 *
 * - Connects on mount / reconnects when `roomId` changes.
 * - Dispatches `applyServerState` into the store on server events.
 * - Disconnects and resets status on unmount.
 *
 * In mock mode (default), the socket is a no-op and status jumps straight
 * to `'connected'` so the game is immediately playable offline.
 */
export function useRoom(roomId: string): { connectionStatus: ConnectionStatus } {
  const setRoomId = useGameStore((s) => s.setRoomId);
  const setConnectionStatus = useGameStore((s) => s.setConnectionStatus);
  const applyServerState = useGameStore((s) => s.applyServerState);
  const resetGame = useGameStore((s) => s.resetGame);
  const playerId = useGameStore((s) => s.playerId) ?? 'local-player';
  const connectionStatus = useGameStore((s) => s.connectionStatus);

  useEffect(() => {
    setRoomId(roomId);
    setConnectionStatus('connecting');

    function handleStateUpdate(
      event: Extract<ServerEvent, { type: 'GAME_STATE_UPDATE' }>,
    ) {
      applyServerState(event.payload);
    }

    socketService.on('GAME_STATE_UPDATE', handleStateUpdate);
    socketService.connect(roomId, playerId);

    // In mock mode the socket doesn't actually connect, so set
    // status to 'connected' optimistically so UI shows as ready.
    setConnectionStatus('connected');

    return () => {
      socketService.off('GAME_STATE_UPDATE', handleStateUpdate);
      socketService.disconnect();
      roomService.leaveRoom(roomId, playerId).catch(() => {});
      resetGame();
    };
  }, [roomId, playerId, resetGame]); // eslint-disable-line react-hooks/exhaustive-deps

  return { connectionStatus };
}

