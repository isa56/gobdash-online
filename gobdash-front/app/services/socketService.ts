import type { ClientEvent, ServerEvent } from '~/types/server';
import { appConfig } from '~/config';

type EventHandler = (event: ServerEvent) => void;

/**
 * WebSocket client wrapper.
 *
 * The mode and server URL are defined together in app/config.ts and selected
 * by the Vite build mode.
 */
class SocketService {
  private ws: WebSocket | null = null;
  private handlers: Map<ServerEvent['type'], Set<EventHandler>> = new Map();

  connect(roomId: string, playerId: string): void {
    if (appConfig.mockMode) {
      console.info(`[SocketService] 🔌 Mock mode — room "${roomId}", player "${playerId}"`);
      return;
    }

    this.disconnect();
    const url = `${appConfig.socketBaseUrl}/rooms/${roomId}?playerId=${encodeURIComponent(playerId)}`;
    this.ws = new WebSocket(url);

    this.ws.onopen = () => {
      console.info('[SocketService] Connected to', url);
    };

    this.ws.onmessage = (e: MessageEvent<string>) => {
      try {
        const event = JSON.parse(e.data) as ServerEvent;
        this.emit(event);
      } catch {
        console.error('[SocketService] Failed to parse message:', e.data);
      }
    };

    this.ws.onclose = () => {
      console.info('[SocketService] Disconnected');
    };

    this.ws.onerror = (e) => {
      console.error('[SocketService] Error:', e);
    };
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  send(event: ClientEvent): void {
    if (appConfig.mockMode) {
      console.info('[SocketService] 📤 Mock send:', event);
      return;
    }
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(event));
    } else {
      console.warn('[SocketService] Cannot send — socket not open');
    }
  }

  on<T extends ServerEvent['type']>(
    type: T,
    handler: (event: Extract<ServerEvent, { type: T }>) => void,
  ): void {
    if (!this.handlers.has(type)) {
      this.handlers.set(type, new Set());
    }
    this.handlers.get(type)!.add(handler as EventHandler);
  }

  off<T extends ServerEvent['type']>(
    type: T,
    handler: (event: Extract<ServerEvent, { type: T }>) => void,
  ): void {
    this.handlers.get(type)?.delete(handler as EventHandler);
  }

  private emit(event: ServerEvent): void {
    this.handlers.get(event.type)?.forEach((h) => h(event));
  }
}

/** Singleton — import this everywhere instead of constructing a new instance. */
export const socketService = new SocketService();
