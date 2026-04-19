import React, { useMemo } from 'react';
import { Platform, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';

import { useColors } from '@/hooks/useColors';
import { useIsDark } from '@/hooks/useColors';
import { borderRadius } from '@m2/design';
import type { ThemeColors } from '@m2/design';

interface GlassCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  /** Blur intensity 0–100. iOS only — Android falls back to solid surface. Default 30. */
  intensity?: number;
}

export function GlassCard({ children, style, intensity = 30 }: GlassCardProps) {
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
          <View style={styles.leftHighlight} pointerEvents="none" />
        </>
      )}
      {children}
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      borderRadius: borderRadius.sm,
      overflow: 'hidden',
    },
    androidBg: {
      backgroundColor: colors.surfaceContainer,
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
      height: 0.5,
      backgroundColor: colors.glass.highlight,
    },
    leftHighlight: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: 0.5,
      height: '100%',
      backgroundColor: colors.glass.highlight,
    },
  });
