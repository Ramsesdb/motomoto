import { useWebSocketStore } from '@/store/useWebSocketStore';
import type { WebSocketStatus } from '@/store/useWebSocketStore';

interface UseWebSocketResult {
  status: WebSocketStatus;
  isConnected: boolean;
}

/**
 * Exposes WebSocket connection status from the store.
 * Components should read this instead of accessing wsService directly.
 */
export function useWebSocket(): UseWebSocketResult {
  const status = useWebSocketStore((s) => s.status);
  return { status, isConnected: status === 'connected' };
}
