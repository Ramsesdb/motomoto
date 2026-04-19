import type { Conversation } from '@m2/types';
import { MOCK_AGENT, MOCK_MANAGER } from './users';
import {
  MOCK_MESSAGES_WA,
  MOCK_MESSAGES_IG,
  MOCK_MESSAGES_FB,
  MOCK_MESSAGES_SMS,
  MOCK_MESSAGES_EMAIL,
} from './messages';

export const MOCK_CONVERSATIONS: Conversation[] = [
  // ─── WhatsApp — open, 3 unread, aiContext ──────────────────────────────────
  {
    id: 'conv-wa-001',
    contact: {
      id: 'contact-001',
      name: 'María López',
      phoneNumber: '+52 55 1234 5678',
      firstSeenAt: '2025-01-10T08:00:00.000Z',
      lastSeenAt: '2025-03-17T10:05:00.000Z',
    },
    channelType: 'whatsapp',
    status: 'open',
    priority: 'high',
    assignedAgent: MOCK_AGENT,
    lastMessage: MOCK_MESSAGES_WA[MOCK_MESSAGES_WA.length - 1],
    unreadCount: 3,
    createdAt: '2025-01-10T08:00:00.000Z',
    updatedAt: '2025-03-17T10:05:00.000Z',
    aiContext: {
      summary:
        'La cliente consulta sobre mantenimiento básico e indica intención de agendar esta semana. Alta probabilidad de conversión.',
      dominantClassification: 'purchase_intent',
      purchaseIntentScore: 0.87,
      analyzedAt: '2025-03-17T10:06:00.000Z',
    },
  },

  // ─── Instagram — open, 2 unread ────────────────────────────────────────────
  {
    id: 'conv-ig-001',
    contact: {
      id: 'contact-002',
      name: 'Valentina Torres',
      firstSeenAt: '2025-03-17T09:00:00.000Z',
      lastSeenAt: '2025-03-17T09:30:00.000Z',
    },
    channelType: 'instagram',
    status: 'open',
    priority: 'normal',
    assignedAgent: MOCK_AGENT,
    lastMessage: MOCK_MESSAGES_IG[MOCK_MESSAGES_IG.length - 1],
    unreadCount: 2,
    createdAt: '2025-03-17T09:00:00.000Z',
    updatedAt: '2025-03-17T09:30:00.000Z',
  },

  // ─── Facebook — pending, 0 unread ──────────────────────────────────────────
  {
    id: 'conv-fb-001',
    contact: {
      id: 'contact-003',
      name: 'Miguel Ramírez',
      phoneNumber: '+52 33 9876 5432',
      firstSeenAt: '2024-12-01T10:00:00.000Z',
      lastSeenAt: '2025-03-16T16:10:00.000Z',
    },
    channelType: 'facebook',
    status: 'pending',
    priority: 'urgent',
    assignedAgent: MOCK_MANAGER,
    lastMessage: MOCK_MESSAGES_FB[MOCK_MESSAGES_FB.length - 1],
    unreadCount: 0,
    createdAt: '2024-12-01T10:00:00.000Z',
    updatedAt: '2025-03-16T16:10:00.000Z',
  },

  // ─── SMS — open, 1 unread ──────────────────────────────────────────────────
  {
    id: 'conv-sms-001',
    contact: {
      id: 'contact-004',
      name: 'Sofía Martínez',
      phoneNumber: '+52 81 5555 0000',
      firstSeenAt: '2025-03-17T11:00:00.000Z',
      lastSeenAt: '2025-03-17T11:30:00.000Z',
    },
    channelType: 'sms',
    status: 'open',
    priority: 'normal',
    assignedAgent: MOCK_AGENT,
    lastMessage: MOCK_MESSAGES_SMS[MOCK_MESSAGES_SMS.length - 1],
    unreadCount: 1,
    createdAt: '2025-03-17T11:00:00.000Z',
    updatedAt: '2025-03-17T11:30:00.000Z',
  },

  // ─── Email — resolved, 0 unread ────────────────────────────────────────────
  {
    id: 'conv-email-001',
    contact: {
      id: 'contact-005',
      name: 'Diego Gómez',
      email: 'diego.gomez@mensajerias.com.mx',
      firstSeenAt: '2025-03-15T09:00:00.000Z',
      lastSeenAt: '2025-03-16T08:00:00.000Z',
    },
    channelType: 'email',
    status: 'resolved',
    priority: 'high',
    assignedAgent: MOCK_MANAGER,
    lastMessage: MOCK_MESSAGES_EMAIL[MOCK_MESSAGES_EMAIL.length - 1],
    unreadCount: 0,
    createdAt: '2025-03-15T09:00:00.000Z',
    updatedAt: '2025-03-16T09:00:00.000Z',
  },
];
