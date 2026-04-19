import { Stack } from 'expo-router';

/**
 * Inbox tab — nested Stack.
 * Screens:
 *   index         → conversation list
 *   [id]/index    → chat view
 *   [id]/client   → contact profile sheet (modal slide-up)
 *
 * All headers are hidden; each screen manages its own navigation chrome.
 */
export default function InboxLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }} />
  );
}
