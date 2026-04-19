import { Stack } from 'expo-router';

/**
 * AI tab — nested Stack.
 * Screens:
 *   index       → AI Center hub
 *   suggestions → Suggested replies feature
 *   summary     → Conversation summary feature
 *   classify    → Message classification feature
 *   chatbot     → Chatbot status feature
 */
export default function AILayout() {
  return (
    <Stack screenOptions={{ headerShown: false }} />
  );
}
