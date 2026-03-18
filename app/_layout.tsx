import { useEffect, useState } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { useAuthStore } from '@/store/useAuthStore';
import { useThemeStore } from '@/store/useThemeStore';
import { useShallow } from 'zustand/react/shallow';
import { useColors, useIsDark } from '@/hooks/useColors';
import { ToastProvider } from '@/components/ui/Toast';

export default function RootLayout() {
  const { isAuthenticated, rehydrate } = useAuthStore(
    useShallow((s) => ({
      isAuthenticated: s.isAuthenticated,
      rehydrate: s.rehydrate,
    }))
  );
  const rehydrateTheme = useThemeStore((s) => s.rehydrate);

  const colors = useColors();
  const isDark = useIsDark();

  const [isReady, setIsReady] = useState(false);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    Promise.all([rehydrate(), rehydrateTheme()]).finally(() => setIsReady(true));
  }, [rehydrate, rehydrateTheme]);

  useEffect(() => {
    if (!isReady) return;
    const inAuthGroup = segments[0] === '(auth)';
    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/(auth)/login' as never);
    } else if (isAuthenticated && inAuthGroup) {
      router.replace('/(app)/home' as never);
    }
  }, [isAuthenticated, isReady, segments, router]);

  if (!isReady) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.background.primary }}>
      <SafeAreaProvider>
        <ToastProvider>
          <StatusBar style={isDark ? 'light' : 'dark'} />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: colors.background.primary },
              animation: 'fade',
            }}
          />
        </ToastProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
