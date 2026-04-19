import type { ChannelType } from './channel';

export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed';

/** Direction from the perspective of the agent/platform */
export type MessageRole = 'inbound' | 'outbound';

export type MessageClassification =
  | 'question'
  | 'complaint'
  | 'purchase_intent'
  | 'greeting'
  | 'other';

export interface MessageAttachment {
  id: string;
  type: 'image' | 'video' | 'audio' | 'document';
  url: string;
  mimeType: string;
  filename?: string;
  sizeBytes?: number;
}

export interface Message {
  id: string;
  conversationId: string;
  channelType: ChannelType;
  role: MessageRole;
  content: string;
  status: MessageStatus;
  attachments?: MessageAttachment[];
  /** ISO 8601 timestamp */
  sentAt: string;
  /** Set when the message was delivered to the recipient */
  deliveredAt?: string;
  /** Set when the recipient read the message */
  readAt?: string;
  // AI fields — always optional
  suggestedReply?: string;
  classification?: MessageClassification;
}
