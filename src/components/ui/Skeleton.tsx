import React, { useEffect, useMemo } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
  Easing,
} from 'react-native-reanimated';

import { useColors } from '@/hooks/useColors';
import { borderRadius as br, spacing } from '@/design';
import type { ThemeColors } from '@/design';

interface SkeletonProps {
  width?: number | `${number}%`;
  height?: number;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
}

export function Skeleton({ width, height = 16, borderRadius = br.md, style }: SkeletonProps) {
  const colors = useColors();
  const shimmer = useSharedValue(0);

  useEffect(() => {
    shimmer.value = withRepeat(
      withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, [shimmer]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(shimmer.value, [0, 1], [0.3, 0.7]),
  }));

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: colors.background.elevated,
        },
        animatedStyle,
        style,
      ]}
    />
  );
}

// ─── Preset skeletons ─────────────────────────────────────────────────────────

export function SkeletonMetricCard() {
  const colors = useColors();
  const styles = useMemo(() => createCardStyles(colors), [colors]);

  return (
    <View style={styles.card}>
      <Skeleton width={36} height={36} borderRadius={br.md} />
      <Skeleton width={60} height={28} borderRadius={br.sm} />
      <Skeleton width="80%" height={12} borderRadius={br.xs} />
    </View>
  );
}

export function SkeletonMetricsGrid() {
  return (
    <View style={presetStyles.grid}>
      <SkeletonMetricCard />
      <SkeletonMetricCard />
      <SkeletonMetricCard />
      <SkeletonMetricCard />
    </View>
  );
}

export function SkeletonConversationRow() {
  const colors = useColors();
  const styles = useMemo(() => createRowStyles(colors), [colors]);

  return (
    <View style={styles.row}>
      <Skeleton width={48} height={48} borderRadius={24} />
      <View style={styles.content}>
        <View style={styles.topRow}>
          <Skeleton width="60%" height={14} borderRadius={br.xs} />
          <Skeleton width={36} height={10} borderRadius={br.xs} />
        </View>
        <Skeleton width="85%" height={12} borderRadius={br.xs} />
      </View>
    </View>
  );
}

export function SkeletonConversationList({ count = 6 }: { count?: number }) {
  return (
    <View>
      {Array.from({ length: count }, (_, i) => (
        <SkeletonConversationRow key={i} />
      ))}
    </View>
  );
}

export function SkeletonTeamRow() {
  const colors = useColors();
  const styles = useMemo(() => createTeamRowStyles(colors), [colors]);

  return (
    <View style={styles.row}>
      <Skeleton width={44} height={44} borderRadius={22} />
      <View style={styles.content}>
        <Skeleton width="55%" height={14} borderRadius={br.xs} />
        <Skeleton width="70%" height={10} borderRadius={br.xs} />
      </View>
      <Skeleton width={56} height={22} borderRadius={br.full} />
    </View>
  );
}

export function SkeletonTeamList({ count = 4 }: { count?: number }) {
  return (
    <View style={presetStyles.teamList}>
      {Array.from({ length: count }, (_, i) => (
        <SkeletonTeamRow key={i} />
      ))}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const presetStyles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[3],
  },
  teamList: {
    paddingHorizontal: spacing[4],
    gap: spacing[2],
  },
});

const createCardStyles = (colors: ThemeColors) => StyleSheet.create({
  card: {
    width: '47%',
    flexGrow: 1,
    padding: spacing[4],
    gap: spacing[2],
    minHeight: 120,
    borderRadius: br.xl,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.separator.transparent,
    backgroundColor: colors.background.secondary,
  },
});

const createRowStyles = (colors: ThemeColors) => StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    gap: spacing[3],
  },
  content: {
    flex: 1,
    gap: spacing[2],
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

const createTeamRowStyles = (colors: ThemeColors) => StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
    backgroundColor: colors.background.tertiary,
    borderRadius: br.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.separator.transparent,
  },
  content: {
    flex: 1,
    gap: spacing[1],
  },
});
