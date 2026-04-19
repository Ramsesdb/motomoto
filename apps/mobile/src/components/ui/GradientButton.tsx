import React from 'react';
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { fontFamily, typography } from '@m2/design';
import { spacing, borderRadius } from '@m2/design';
import { useColors } from '@/hooks/useColors';
import { Pressable } from '@/components/ui/Pressable';

// ─── Types ───────────────────────────────────────────────────────────────────

interface GradientButtonProps {
  /** Button label text */
  label: string;
  /** Press handler */
  onPress: () => void;
  /** Greyed-out, non-interactive state */
  disabled?: boolean;
  /** Show a spinner instead of the label */
  loading?: boolean;
  /** Stretch to fill parent width */
  fullWidth?: boolean;
  /** Additional styles applied to the outer wrapper */
  style?: StyleProp<ViewStyle>;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const GRADIENT_START = { x: 0, y: 0 };
const GRADIENT_END = { x: 1, y: 1 }; // 135deg approximation

// ─── Component ───────────────────────────────────────────────────────────────

export function GradientButton({
  label,
  onPress,
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
}: GradientButtonProps) {
  const colors = useColors();

  const glowShadow: ViewStyle =
    Platform.OS === 'ios'
      ? {
          shadowColor: colors.primary,
          shadowRadius: 12,
          shadowOpacity: 0.4,
          shadowOffset: { width: 0, height: 4 },
        }
      : {
          elevation: 8,
        };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading }}
      style={[
        styles.wrapper,
        fullWidth ? styles.fullWidth : undefined,
        disabled ? styles.disabled : undefined,
        style,
      ]}
    >
      <LinearGradient
        colors={[colors.primaryContainer, colors.primary]}
        start={GRADIENT_START}
        end={GRADIENT_END}
        style={[styles.gradient, glowShadow]}
      >
        {loading ? (
          <ActivityIndicator color={colors.onPrimary} size="small" />
        ) : (
          <Text style={[styles.label, { color: colors.onPrimary }]}>{label}</Text>
        )}
      </LinearGradient>
    </Pressable>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  wrapper: {
    alignSelf: 'center',
  },
  fullWidth: {
    alignSelf: 'stretch',
  },
  disabled: {
    opacity: 0.45,
  },
  gradient: {
    height: 52,
    borderRadius: borderRadius.sm, // 8
    paddingHorizontal: spacing[4], // 16
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    ...typography.headline,
    fontFamily: fontFamily.bodySemiBold,
    fontWeight: '600',
  },
});
