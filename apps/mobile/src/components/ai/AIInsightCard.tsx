import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useColors } from '@/hooks/useColors';
import { GlassCard } from '@/components/ui/GlassCard';
import { fontFamily, typography } from '@/design/typography';
import { borderRadius, spacing } from '@/design/spacing';
import type { ThemeColors } from '@/design/colors';

export interface AIInsightCardProps {
  title: string;
  body: string;
  ctaLabel?: string;
  onCtaPress?: () => void;
  onDismiss?: () => void;
  variant?: 'default' | 'inline';
}

export function AIInsightCard({
  title,
  body,
  ctaLabel,
  onCtaPress,
  onDismiss,
  variant = 'default',
}: AIInsightCardProps) {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors, variant), [colors, variant]);

  return (
    <GlassCard style={styles.card}>
      <LinearGradient
        colors={['rgba(125,1,177,0.1)', 'transparent']}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.inner}>
        {onDismiss ? (
          <Pressable
            onPress={onDismiss}
            style={({ pressed }) => [
              styles.dismissButton,
              { opacity: pressed ? 0.5 : 1 },
            ]}
            hitSlop={8}
          >
            <MaterialCommunityIcons
              name="close"
              size={18}
              color={colors.onSurfaceVariant}
            />
          </Pressable>
        ) : null}

        <View style={styles.header}>
          <View style={styles.iconCircle}>
            <MaterialCommunityIcons
              name="robot-outline"
              size={20}
              color={colors.secondary}
            />
          </View>
          <Text style={styles.title}>{title}</Text>
        </View>

        <Text style={styles.body}>{body}</Text>

        {ctaLabel && onCtaPress ? (
          <Pressable
            onPress={onCtaPress}
            style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
          >
            <Text style={styles.cta}>{ctaLabel}</Text>
          </Pressable>
        ) : null}
      </View>
    </GlassCard>
  );
}

const createStyles = (colors: ThemeColors, variant: 'default' | 'inline') => {
  const isInline = variant === 'inline';
  return StyleSheet.create({
    card: {
      borderRadius: borderRadius.sm,
      padding: 0,
      overflow: 'hidden',
    },
    inner: {
      padding: isInline ? spacing[3] : spacing[4],
    },
    dismissButton: {
      position: 'absolute',
      top: isInline ? spacing[2] : spacing[3],
      right: isInline ? spacing[2] : spacing[3],
      zIndex: 1,
      padding: spacing[1],
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing[2],
      marginBottom: isInline ? spacing[1] : spacing[2],
    },
    iconCircle: {
      width: 36,
      height: 36,
      borderRadius: borderRadius.full,
      backgroundColor: `${colors.secondaryContainer}33`, // 20% opacity
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      fontFamily: fontFamily.bodySemiBold,
      ...typography.headlineSmall,
      fontSize: isInline ? 16 : typography.headlineSmall.fontSize,
      lineHeight: isInline ? 22 : typography.headlineSmall.lineHeight,
      fontWeight: '600',
      color: colors.secondary,
      flex: 1,
    },
    body: {
      fontFamily: fontFamily.bodyRegular,
      ...typography.bodyMedium,
      color: colors.onSurface,
      marginBottom: isInline ? spacing[1] : spacing[3],
    },
    cta: {
      fontFamily: fontFamily.bodySemiBold,
      ...typography.labelLarge,
      color: colors.secondary,
      fontWeight: '600',
    },
  });
};
