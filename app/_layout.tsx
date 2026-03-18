import { useEffect, useState } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { useAuthStore } from '@/store/useAuthStore';
import { useShallow } from 'zustand/react/shallow';

/**
 * Root layout — wraps the entire app.
 *
 * Responsibilities:
 * 1. GestureHandlerRootView + SafeAreaProvider (required at root)
 * 2. Rehydrate auth state from expo-secure-store on launch
 * 3. Auth gate — redirect to (auth) or (app) depending on authentication state
 *
 * Fonts: system fonts (SF Pro / Roboto) — no custom font loading required.
 */
export default function RootLayout() {
  const { isAuthenticated, rehydrate } = useAuthStore(
    useShallow((s) => ({
      isAuthenticated: s.isAuthenticated,
      rehydrate: s.rehydrate,
    }))
  );

  const [isReady, setIsReady] = useState(false);
  const segments = useSegments();
  const router = useRouter();

  // Rehydrate persisted auth state once on mount
  useEffect(() => {
    rehydrate().finally(() => setIsReady(true));
  }, [rehydrate]);

  // Redirect based on auth state after rehydration is complete
  useEffect(() => {
    if (!isReady) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!isAuthenticated && !inAuthGroup) {
      // Not logged in — send to login screen
      router.replace('/(auth)/login' as never);
    } else if (isAuthenticated && inAuthGroup) {
      // Already authenticated — send to main app
      router.replace('/(app)/home' as never);
    }
  }, [isAuthenticated, isReady, segments, router]);

  // Hold rendering until rehydration resolves (avoids flash of wrong screen)
  if (!isReady) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="light" />
        <Stack screenOptions={{ headerShown: false }} />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
