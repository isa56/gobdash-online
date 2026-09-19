import type { ClientEvent, ServerEvent } from '~/types/server';

type EventHandler = (event: ServerEvent) => void;

/**
 * WebSocket client wrapper.
 *
 * Set `MOCK_MODE = true` (the default) to run fully offline — all sends are
 * logged to the console and no real socket is opened.
 * Flip it to `false` and provide a server URL to connect for real.
 */
class SocketService {
  private ws: WebSocket | null = null;
  private handlers: Map<ServerEvent['type'], Set<EventHandler>> = new Map();

  /** Toggle to false and set serverUrl in connect() when a real server is ready. */
  readonly mockMode = true;

  connect(roomId: string, playerId: string, serverUrl = 'ws://localhost:8080'): void {
    if (this.mockMode) {
      console.info(`[SocketService] 🔌 Mock mode — room "${roomId}", player "${playerId}"`);
      return;
    }

    this.disconnect();
    const url = `${serverUrl}/rooms/${roomId}?playerId=${encodeURIComponent(playerId)}`;
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
    if (this.mockMode) {
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

