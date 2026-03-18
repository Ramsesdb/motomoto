import { create } from 'zustand';

export type WebSocketStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

interface WebSocketStoreState {
  status: WebSocketStatus;
  setStatus: (status: WebSocketStatus) => void;
}

export const useWebSocketStore = create<WebSocketStoreState>((set) => ({
  status: 'disconnected',
  setStatus: (status: WebSocketStatus) => set({ status }),
}));
