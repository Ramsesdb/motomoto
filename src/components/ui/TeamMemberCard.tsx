import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useColors } from '@/hooks/useColors';
import { spacing, typography, borderRadius } from '@/design';
import type { ThemeColors } from '@/design';
import type { User, UserRole } from '@/types';
import { Avatar } from '@/components/ui/Avatar';
import { GlassCard } from '@/components/ui/GlassCard';
import { Pressable } from '@/components/ui/Pressable';

interface TeamMemberCardProps {
  user: User;
  stats?: { label: string; value: string };
  activityLabel?: string;
  onPress?: () => void;
}

function getRoleBadgeColor(role: UserRole, colors: ThemeColors): string {
  if (role === 'admin') return colors.secondary;
  if (role === 'manager') return colors.tertiary;
  return colors.primary; // agent
}

function getRoleBadgeBgColor(role: UserRole, colors: ThemeColors): string {
  if (role === 'admin') return colors.secondaryContainer;
  if (role === 'manager') return colors.tertiaryContainer;
  return colors.primaryContainer; // agent
}

function getRoleLabel(role: UserRole): string {
  if (role === 'admin') return 'Admin';
  if (role === 'manager') return 'Manager';
  return 'Agente';
}

export function TeamMemberCard({ user, stats, activityLabel, onPress }: TeamMemberCardProps) {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const badgeColor = getRoleBadgeColor(user.role, colors);
  const badgeBgColor = getRoleBadgeBgColor(user.role, colors);
  const statusColor = colors.status[user.status];

  const content = (
    <GlassCard style={styles.card}>
      <View style={styles.row}>
        <Avatar name={user.name} uri={user.avatarUrl} size={44} status={user.status} />

        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={1}>
            {user.name}
          </Text>
          <View style={[styles.roleBadge, { backgroundColor: badgeBgColor }]}>
            <Text style={[styles.roleBadgeText, { color: badgeColor }]}>
              {getRoleLabel(user.role)}
            </Text>
          </View>
        </View>

        {stats !== undefined && (
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.value}</Text>
            <Text style={styles.statLabel}>{stats.label}</Text>
          </View>
        )}

        {activityLabel !== undefined && (
          <View style={styles.activityContainer}>
            <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
            <Text style={styles.activityText}>{activityLabel}</Text>
          </View>
        )}
      </View>
    </GlassCard>
  );

  if (onPress !== undefined) {
    return <Pressable onPress={onPress}>{content}</Pressable>;
  }

  return content;
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    card: {
      borderRadius: borderRadius.sm,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacing[3],
      paddingHorizontal: spacing[4],
      gap: spacing[3],
    },
    info: {
      flex: 1,
      gap: spacing[1],
    },
    name: {
      ...typography.callout,
      fontWeight: '600',
      color: colors.onSurface,
    },
    roleBadge: {
      alignSelf: 'flex-start',
      paddingHorizontal: spacing[2],
      paddingVertical: 2,
      borderRadius: borderRadius.full,
    },
    roleBadgeText: {
      ...typography.caption2,
      fontWeight: '600',
    },
    statItem: {
      alignItems: 'center',
    },
    statValue: {
      ...typography.caption1,
      fontWeight: '600',
      color: colors.onSurface,
    },
    statLabel: {
      ...typography.caption2,
      color: colors.onSurfaceVariant,
    },
    activityContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing[1],
    },
    statusDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
    },
    activityText: {
      ...typography.caption2,
      color: colors.onSurfaceVariant,
    },
  });
