import type { WebSocketEvent, WebSocketMessage } from '@/types';

type EventHandler<E extends WebSocketEvent> = (
  payload: Extract<WebSocketMessage, { event: E }>['payload'],
) => void;

// Internal map stores handlers as generic callbacks to avoid a type-per-event map.
// The public `onEvent` API is fully typed — the cast is isolated here.
type HandlerSet = Set<(payload: unknown) => void>;
type HandlerMap = Map<WebSocketEvent, HandlerSet>;

export class WebSocketService {
  private readonly handlers: HandlerMap = new Map();
  private connected = false;

  /** Open the WebSocket connection using the provided auth token. */
  connect(_token: string): void {
    // Stub: in production, open a native WebSocket to the API server.
    this.connected = true;
  }

  /** Close the connection and remove all event handlers. */
  disconnect(): void {
    this.connected = false;
    this.handlers.clear();
  }

  get isConnected(): boolean {
    return this.connected;
  }

  /**
   * Subscribe to a typed WebSocket event.
   * @returns An unsubscribe function — call it to remove the handler.
   */
  onEvent<E extends WebSocketEvent>(
    event: E,
    handler: EventHandler<E>,
  ): () => void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set());
    }
    const set = this.handlers.get(event) as HandlerSet;
    const genericHandler = handler as (payload: unknown) => void;
    set.add(genericHandler);
    return () => {
      set.delete(genericHandler);
    };
  }

  /**
   * Dispatch a parsed server message to all registered handlers.
   * Used internally (and in tests/simulation) to feed incoming events.
   */
  dispatch(wsMessage: WebSocketMessage): void {
    const set = this.handlers.get(wsMessage.event);
    if (!set) return;
    for (const handler of set) {
      handler(wsMessage.payload);
    }
  }
}

/** Singleton WebSocket service instance. */
export const wsService = new WebSocketService();
