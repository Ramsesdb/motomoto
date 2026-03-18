import type { ChannelType } from './channel';
import type { Message, MessageClassification } from './message';
import type { User } from './user';

export type ConversationStatus = 'open' | 'pending' | 'resolved' | 'spam';

export type ConversationPriority = 'low' | 'normal' | 'high' | 'urgent';

export interface Contact {
  id: string;
  name: string;
  phoneNumber?: string;
  email?: string;
  avatarUrl?: string;
  /** ISO 8601 timestamp of first contact */
  firstSeenAt: string;
  /** ISO 8601 timestamp of most recent interaction */
  lastSeenAt: string;
}

export interface AIContext {
  summary?: string;
  dominantClassification?: MessageClassification;
  /** 0–1 score indicating how likely the contact is to convert */
  purchaseIntentScore?: number;
  /** ISO 8601 timestamp of the last AI analysis */
  analyzedAt?: string;
}

export interface Conversation {
  id: string;
  contact: Contact;
  channelType: ChannelType;
  status: ConversationStatus;
  priority: ConversationPriority;
  assignedAgent?: User;
  lastMessage?: Message;
  unreadCount: number;
  /** ISO 8601 */
  createdAt: string;
  /** ISO 8601 */
  updatedAt: string;
  // AI fields — always optional
  aiContext?: AIContext;
}
