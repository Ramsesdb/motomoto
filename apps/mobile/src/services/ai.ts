import { MOCK_CONVERSATIONS, MOCK_MESSAGES } from '@/mock';
import type { AIContext, ApiResponse, MessageClassification } from '@m2/types';

export interface ChatbotStatus {
  channelId: string;
  isActive: boolean;
  botName: string;
  handoffEnabled: boolean;
}

/**
 * Get the AI-suggested reply for the most recent inbound message
 * in a conversation. Returns null if no suggestion is available.
 */
export async function getSuggestion(
  conversationId: string,
): Promise<ApiResponse<string | null>> {
  const messages = MOCK_MESSAGES[conversationId] ?? [];
  const lastMessage = messages[messages.length - 1];
  const suggestion = lastMessage?.suggestedReply ?? null;
  return Promise.resolve({ data: suggestion, success: true });
}

/**
 * Return the AI context (summary, classification, purchase intent score)
 * cached for a conversation. Returns null if no analysis exists yet.
 */
export async function summarizeConversation(
  conversationId: string,
): Promise<ApiResponse<AIContext | null>> {
  const conversation = MOCK_CONVERSATIONS.find((c) => c.id === conversationId);
  const aiContext = conversation?.aiContext ?? null;
  return Promise.resolve({ data: aiContext, success: true });
}

/**
 * Return the AI classification for a specific message.
 * Returns null if the message has no classification.
 */
export async function classifyMessage(
  messageId: string,
): Promise<ApiResponse<MessageClassification | null>> {
  const allMessages = Object.values(MOCK_MESSAGES).flat();
  const message = allMessages.find((m) => m.id === messageId);
  const classification = message?.classification ?? null;
  return Promise.resolve({ data: classification, success: true });
}

/**
 * Return the chatbot status for a given channel.
 * Stub always returns inactive (manual handoff enabled).
 */
export async function getChatbotStatus(
  channelId: string,
): Promise<ApiResponse<ChatbotStatus>> {
  const status: ChatbotStatus = {
    channelId,
    isActive: false,
    botName: 'MotoBot',
    handoffEnabled: true,
  };
  return Promise.resolve({ data: status, success: true });
}
