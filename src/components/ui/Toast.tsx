import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  FadeInUp,
  FadeOutUp,
  LinearTransition,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useColors } from '@/hooks/useColors';
import { borderRadius, spacing, typography } from '@/design';
import type { ThemeColors } from '@/design';

// ─── Types ────────────────────────────────────────────────────────────────────

type ToastVariant = 'success' | 'error' | 'info' | 'warning';

interface ToastItem {
  id: number;
  message: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  show: (message: string, variant?: ToastVariant) => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (ctx === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return ctx;
}

// ─── Icon map ─────────────────────────────────────────────────────────────────

const VARIANT_ICON: Record<ToastVariant, React.ComponentProps<typeof MaterialCommunityIcons>['name']> = {
  success: 'check-circle-outline',
  error: 'alert-circle-outline',
  info: 'information-outline',
  warning: 'alert-outline',
};

function getVariantColor(variant: ToastVariant, colors: ThemeColors): string {
  switch (variant) {
    case 'success': return colors.accent.success;
    case 'error': return colors.accent.error;
    case 'info': return colors.accent.info;
    case 'warning': return colors.accent.warning;
  }
}

function getVariantBg(variant: ToastVariant, colors: ThemeColors): string {
  switch (variant) {
    case 'success': return colors.accent.successMuted;
    case 'error': return colors.accent.errorMuted;
    case 'info': return colors.accent.infoMuted;
    case 'warning': return colors.accent.warningMuted;
  }
}

// ─── Provider ─────────────────────────────────────────────────────────────────

const TOAST_DURATION = 3000;
let nextId = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const timers = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

  const show = useCallback((message: string, variant: ToastVariant = 'info') => {
    const id = ++nextId;
    setToasts((prev) => [...prev, { id, message, variant }]);
    const timer = setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
      timers.current.delete(id);
    }, TOAST_DURATION);
    timers.current.set(id, timer);
  }, []);

  const value = useMemo(() => ({ show }), [show]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <View style={[styles.container, { top: insets.top + spacing[12] }]} pointerEvents="box-none">
        {toasts.map((toast) => (
          <Animated.View
            key={toast.id}
            entering={FadeInUp.duration(300).springify()}
            exiting={FadeOutUp.duration(200)}
            layout={LinearTransition.springify()}
            style={[
              styles.toast,
              {
                backgroundColor: getVariantBg(toast.variant, colors),
                borderColor: getVariantColor(toast.variant, colors) + '40',
              },
            ]}
          >
            <MaterialCommunityIcons
              name={VARIANT_ICON[toast.variant]}
              size={18}
              color={getVariantColor(toast.variant, colors)}
            />
            <Text style={[styles.message, { color: colors.text.primary }]} numberOfLines={2}>
              {toast.message}
            </Text>
          </Animated.View>
        ))}
      </View>
    </ToastContext.Provider>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: spacing[4],
    right: spacing[4],
    zIndex: 9999,
    alignItems: 'center',
    gap: spacing[2],
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    width: '100%',
  },
  message: {
    flex: 1,
    ...typography.subhead,
    fontWeight: '500',
  },
});
