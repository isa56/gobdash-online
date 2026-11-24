import { useEffect } from 'react';
import { useGameStore } from '~/store/gameStore';
import { socketService } from '~/services/socketService';
import { roomService } from '~/services/roomService';
import type { ConnectionStatus, ServerEvent } from '~/types/server';
import { appConfig } from '~/config';

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
  const setNumberOfPlayers = useGameStore((s) => s.setNumberOfPlayers);
  const setErrorMessage = useGameStore((s) => s.setErrorMessage);
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

    function handleServerError(
      event: Extract<ServerEvent, { type: 'ERROR' }>,
    ) {
      setErrorMessage(event.message);
    }

    function handlePlayerJoined() {
      setNumberOfPlayers((numberOfPlayers) => numberOfPlayers + 1);
    }

    function handlePlayerLeft() {
      setNumberOfPlayers((numberOfPlayers) => Math.max(0, numberOfPlayers - 1));
    }

    function handleConnectionStatus(
      status: Extract<ConnectionStatus, 'connected' | 'disconnected' | 'error'>,
    ) {
      setConnectionStatus(status);
    }

    socketService.on('GAME_STATE_UPDATE', handleStateUpdate);
    socketService.on('ERROR', handleServerError);
    socketService.on('PLAYER_JOINED', handlePlayerJoined);
    socketService.on('PLAYER_LEFT', handlePlayerLeft);
    socketService.onConnectionStatus(handleConnectionStatus);
    socketService.connect(roomId, playerId);

    // In mock mode the socket is a no-op, so mark it ready immediately.
    if (appConfig.mockMode) {
      setConnectionStatus('connected');
    }

    return () => {
      socketService.off('GAME_STATE_UPDATE', handleStateUpdate);
      socketService.off('ERROR', handleServerError);
      socketService.off('PLAYER_JOINED', handlePlayerJoined);
      socketService.off('PLAYER_LEFT', handlePlayerLeft);
      socketService.offConnectionStatus(handleConnectionStatus);
      socketService.disconnect();
      roomService.leaveRoom(roomId, playerId).catch((error: unknown) => {
        console.error('[useRoom] Failed to leave room:', error);
      });
      resetGame();
    };
  }, [
    roomId,
    playerId,
    resetGame,
    setConnectionStatus,
    setErrorMessage,
    setNumberOfPlayers,
    applyServerState,
  ]);

  return { connectionStatus };
}
