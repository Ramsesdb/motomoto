import { create } from 'zustand';

import {
  getConversations,
  getMessages,
  sendMessage as sendMessageService,
} from '@/services/conversations';
import type {
  ChannelType,
  Conversation,
  ConversationStatus,
  Message,
} from '@m2/types';

export interface InboxFilters {
  status?: ConversationStatus;
  channelType?: ChannelType;
  search?: string;
}

interface InboxState {
  conversations: Conversation[];
  /** Messages keyed by conversationId. */
  messages: Record<string, Message[]>;
  filters: InboxFilters;
  lastSyncTimestamp: number | null;

  loadConversations: () => Promise<void>;
  loadMessages: (conversationId: string) => Promise<void>;
  sendMessage: (conversationId: string, content: string) => Promise<void>;
  /** Append a single message from a WebSocket event. */
  appendMessage: (message: Message) => void;
  setFilters: (filters: Partial<InboxFilters>) => void;
  clearFilters: () => void;
}

export const useInboxStore = create<InboxState>((set, get) => ({
  conversations: [],
  messages: {},
  filters: {},
  lastSyncTimestamp: null,

  loadConversations: async () => {
    const response = await getConversations();
    set({
      conversations: response.data,
      lastSyncTimestamp: Date.now(),
    });
  },

  loadMessages: async (conversationId: string) => {
    const response = await getMessages(conversationId);
    set((state) => ({
      messages: {
        ...state.messages,
        [conversationId]: response.data,
      },
    }));
  },

  sendMessage: async (conversationId: string, content: string) => {
    const response = await sendMessageService(conversationId, content);
    if (!response.success) return;
    const message = response.data;
    set((state) => {
      const existing = state.messages[conversationId] ?? [];
      return {
        messages: {
          ...state.messages,
          [conversationId]: [...existing, message],
        },
      };
    });
  },

  appendMessage: (message: Message) => {
    const { conversationId } = message;
    set((state) => {
      const existing = state.messages[conversationId] ?? [];
      // Avoid duplicates if the event fires more than once.
      const alreadyExists = existing.some((m) => m.id === message.id);
      if (alreadyExists) return {};
      return {
        messages: {
          ...state.messages,
          [conversationId]: [...existing, message],
        },
        // Bump lastSyncTimestamp so subscribers know state is fresh.
        lastSyncTimestamp: Date.now(),
      };
    });

    // Keep the conversation's lastMessage in sync.
    set((state) => {
      const convIndex = state.conversations.findIndex(
        (c) => c.id === conversationId,
      );
      if (convIndex === -1) return {};
      const updated = state.conversations.map((c, i) =>
        i === convIndex
          ? {
              ...c,
              lastMessage: message,
              updatedAt: message.sentAt,
              unreadCount:
                message.role === 'inbound' ? c.unreadCount + 1 : c.unreadCount,
            }
          : c,
      );
      return { conversations: updated };
    });
  },

  setFilters: (filters: Partial<InboxFilters>) => {
    set((state) => ({ filters: { ...state.filters, ...filters } }));
  },

  clearFilters: () => {
    set({ filters: {} });
  },
}));
