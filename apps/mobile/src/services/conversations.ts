import { MOCK_CONVERSATIONS, MOCK_MESSAGES } from '@/mock';
import type {
  ApiResponse,
  Conversation,
  Message,
  MessageAttachment,
  PaginatedResponse,
  PaginationParams,
} from '@m2/types';

function paginate<T>(items: T[], params?: PaginationParams): PaginatedResponse<T> {
  const page = params?.page ?? 1;
  const limit = params?.limit ?? 20;
  const start = (page - 1) * limit;
  const slice = items.slice(start, start + limit);
  return {
    data: slice,
    success: true,
    pagination: {
      total: items.length,
      page,
      limit,
      hasNextPage: start + limit < items.length,
    },
  };
}

/** Fetch a paginated list of all conversations. */
export async function getConversations(
  params?: PaginationParams,
): Promise<PaginatedResponse<Conversation>> {
  return Promise.resolve(paginate(MOCK_CONVERSATIONS, params));
}

/** Fetch a paginated list of messages for a given conversation. */
export async function getMessages(
  conversationId: string,
  params?: PaginationParams,
): Promise<PaginatedResponse<Message>> {
  const messages = MOCK_MESSAGES[conversationId] ?? [];
  return Promise.resolve(paginate(messages, params));
}

/** Send an outbound message. Returns the created Message stub. */
export async function sendMessage(
  conversationId: string,
  content: string,
  attachments?: MessageAttachment[],
): Promise<ApiResponse<Message>> {
  const conversation = MOCK_CONVERSATIONS.find((c) => c.id === conversationId);
  const channelType = conversation?.channelType ?? 'whatsapp';

  const newMessage: Message = {
    id: `msg-${conversationId}-${Date.now()}`,
    conversationId,
    channelType,
    role: 'outbound',
    content,
    status: 'sent',
    attachments,
    sentAt: new Date().toISOString(),
    deliveredAt: new Date().toISOString(),
  };

  return Promise.resolve({ data: newMessage, success: true });
}
