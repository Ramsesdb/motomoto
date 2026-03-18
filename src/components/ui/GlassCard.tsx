import React, { useMemo } from 'react';
import { Platform, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';

import { useColors } from '@/hooks/useColors';
import { useIsDark } from '@/hooks/useColors';
import { borderRadius } from '@/design';
import type { ThemeColors } from '@/design';

interface GlassCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  /** Blur intensity 0–100. iOS only — Android falls back to solid surface. Default 60. */
  intensity?: number;
}

export function GlassCard({ children, style, intensity = 60 }: GlassCardProps) {
  const colors = useColors();
  const isDark = useIsDark();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={[styles.container, Platform.OS === 'android' ? styles.androidBg : null, style]}>
      {Platform.OS !== 'android' && (
        <>
          <BlurView intensity={intensity} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
          <View style={styles.overlay} pointerEvents="none" />
          <View style={styles.highlight} pointerEvents="none" />
        </>
      )}
      {children}
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      borderRadius: borderRadius.lg,
      overflow: 'hidden',
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.glass.border,
    },
    androidBg: {
      backgroundColor: colors.background.tertiary,
    },
    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: colors.glass.background,
    },
    highlight: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 1,
      backgroundColor: colors.glass.highlight,
    },
  });
