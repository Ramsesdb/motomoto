import React, { useMemo } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useColors, useIsDark } from '@/hooks/useColors';
import { fontFamily, typography } from '@/design/typography';
import { borderRadius, spacing } from '@/design/spacing';
import type { ThemeColors } from '@/design/colors';

interface GlassHeaderAvatar {
  name: string;
  uri?: string;
  status?: 'online' | 'away' | 'offline';
}

export interface GlassHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  leftAccessory?: React.ReactNode;
  rightAccessory?: React.ReactNode;
  avatar?: GlassHeaderAvatar;
  statusPill?: string;
}

export function GlassHeader({
  title,
  subtitle,
  onBack,
  leftAccessory,
  rightAccessory,
  avatar,
  statusPill,
}: GlassHeaderProps) {
  const colors = useColors();
  const isDark = useIsDark();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const initials = avatar
    ? avatar.name
        .split(' ')
        .slice(0, 2)
        .map((w) => w.charAt(0).toUpperCase())
        .join('')
    : '';

  return (
    <View style={[styles.wrapper, { paddingTop: insets.top }]}>
      {Platform.OS === 'ios' ? (
        <>
          <BlurView
            intensity={30}
            tint={isDark ? 'dark' : 'light'}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.overlay} pointerEvents="none" />
        </>
      ) : (
        <View style={[StyleSheet.absoluteFill, styles.androidBg]} />
      )}

      <View style={styles.content}>
        {/* Left section */}
        <View style={styles.left}>
          {onBack ? (
            <Pressable
              onPress={onBack}
              style={({ pressed }) => [
                styles.backButton,
                { opacity: pressed ? 0.5 : 1 },
              ]}
              hitSlop={8}
            >
              <MaterialCommunityIcons
                name="chevron-left"
                size={24}
                color={colors.onSurface}
              />
            </Pressable>
          ) : null}
          {leftAccessory}
          {avatar ? (
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{initials}</Text>
              </View>
            </View>
          ) : null}
        </View>

        {/* Center section */}
        <View style={styles.center}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          {subtitle ? (
            <Text style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}
          {statusPill ? (
            <View style={styles.statusPill}>
              <Text style={styles.statusPillText}>{statusPill}</Text>
            </View>
          ) : null}
        </View>

        {/* Right section */}
        <View style={styles.right}>{rightAccessory}</View>
      </View>
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    wrapper: {
      minHeight: 56,
      overflow: 'hidden',
    },
    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: `${colors.surfaceContainer}B3`, // 70% opacity
    },
    androidBg: {
      backgroundColor: colors.surfaceContainer,
    },
    content: {
      flexDirection: 'row',
      alignItems: 'center',
      minHeight: 56,
      paddingHorizontal: spacing[4],
    },
    left: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing[2],
    },
    center: {
      flex: 1,
      marginHorizontal: spacing[2],
    },
    right: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing[2],
    },
    backButton: {
      padding: spacing[1],
    },
    avatarContainer: {
      marginRight: spacing[2],
    },
    avatar: {
      width: 36,
      height: 36,
      borderRadius: borderRadius.full,
      backgroundColor: colors.primaryContainer,
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarText: {
      fontFamily: fontFamily.bodySemiBold,
      fontSize: 14,
      fontWeight: '600',
      color: colors.onPrimaryContainer,
    },
    title: {
      fontFamily: fontFamily.bodySemiBold,
      fontSize: 17,
      fontWeight: '600',
      lineHeight: 22,
      color: colors.onSurface,
    },
    subtitle: {
      fontFamily: fontFamily.bodyRegular,
      ...typography.labelMedium,
      color: colors.onSurfaceVariant,
    },
    statusPill: {
      alignSelf: 'flex-start',
      backgroundColor: `${colors.primary}26`, // 15% opacity
      borderRadius: borderRadius.full,
      paddingHorizontal: spacing[2],
      paddingVertical: 2,
      marginTop: 2,
    },
    statusPillText: {
      fontFamily: fontFamily.bodyMedium,
      ...typography.labelSmall,
      color: colors.primary,
    },
  });
