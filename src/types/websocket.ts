import type { Conversation } from './conversation';
import type { Message } from './message';
import type { User, UserStatus } from './user';

// ---------------------------------------------------------------------------
// Event names
// ---------------------------------------------------------------------------

export type WebSocketEvent =
  | 'message.new'
  | 'message.updated'
  | 'message.status_changed'
  | 'conversation.new'
  | 'conversation.updated'
  | 'conversation.assigned'
  | 'conversation.resolved'
  | 'agent.status_changed'
  | 'typing.start'
  | 'typing.stop'
  | 'connection.ack'
  | 'connection.error';

// ---------------------------------------------------------------------------
// Payload types
// ---------------------------------------------------------------------------

export interface MessageNewPayload {
  message: Message;
}

export interface MessageUpdatedPayload {
  message: Message;
}

export interface MessageStatusChangedPayload {
  messageId: string;
  conversationId: string;
  status: Message['status'];
  timestamp: string;
}

export interface ConversationNewPayload {
  conversation: Conversation;
}

export interface ConversationUpdatedPayload {
  conversation: Conversation;
}

export interface ConversationAssignedPayload {
  conversationId: string;
  agent: User;
}

export interface ConversationResolvedPayload {
  conversationId: string;
  resolvedAt: string;
  resolvedBy: string;
}

export interface AgentStatusChangedPayload {
  agentId: string;
  status: UserStatus;
}

export interface TypingPayload {
  conversationId: string;
  contactId: string;
}

export interface ConnectionAckPayload {
  sessionId: string;
  serverTimestamp: string;
}

export interface ConnectionErrorPayload {
  code: string;
  message: string;
}

// ---------------------------------------------------------------------------
// Discriminated union
// ---------------------------------------------------------------------------

export type WebSocketMessage =
  | { event: 'message.new'; payload: MessageNewPayload }
  | { event: 'message.updated'; payload: MessageUpdatedPayload }
  | { event: 'message.status_changed'; payload: MessageStatusChangedPayload }
  | { event: 'conversation.new'; payload: ConversationNewPayload }
  | { event: 'conversation.updated'; payload: ConversationUpdatedPayload }
  | { event: 'conversation.assigned'; payload: ConversationAssignedPayload }
  | { event: 'conversation.resolved'; payload: ConversationResolvedPayload }
  | { event: 'agent.status_changed'; payload: AgentStatusChangedPayload }
  | { event: 'typing.start'; payload: TypingPayload }
  | { event: 'typing.stop'; payload: TypingPayload }
  | { event: 'connection.ack'; payload: ConnectionAckPayload }
  | { event: 'connection.error'; payload: ConnectionErrorPayload };
