import React, { useCallback, useMemo, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
  type ListRenderItemInfo,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { RoleGate } from '@/components/ui/RoleGate';
import { Avatar } from '@/components/ui/Avatar';
import { useColors } from '@/hooks/useColors';
import { spacing, typography, borderRadius, type ThemeColors } from '@/design';
import { MOCK_AGENT, MOCK_MANAGER, MOCK_ADMIN } from '@/mock';
import type { User } from '@/types';

const TEAM_MEMBERS: User[] = [MOCK_MANAGER, MOCK_AGENT, MOCK_ADMIN];

const ROLE_LABEL: Record<string, string> = {
  agent: 'Agente',
  manager: 'Gerente',
  admin: 'Administrador',
};

function getRoleTint(colors: ThemeColors): Record<string, string> {
  return {
    agent: colors.accent.primary,
    manager: colors.accent.success,
    admin: colors.accent.purple,
  };
}

// ─── Team member row ──────────────────────────────────────────────────────────

function MemberRow({ item, index }: { item: User; index: number }) {
  const colors = useColors();
  const memberStyles = useMemo(() => createMemberStyles(colors), [colors]);
  const roleTint = useMemo(() => getRoleTint(colors), [colors]);
  const tint = roleTint[item.role] ?? colors.accent.primary;

  return (
    <Animated.View entering={FadeInDown.duration(350).delay(200 + index * 60)}>
      <View style={memberStyles.row}>
        <Avatar name={item.name} uri={item.avatarUrl} size={44} status={item.status} />
        <View style={memberStyles.info}>
          <Text style={memberStyles.name}>{item.name}</Text>
          <Text style={memberStyles.email} numberOfLines={1}>{item.email}</Text>
        </View>
        <View style={[memberStyles.badge, { backgroundColor: tint + '18' }]}>
          <Text style={[memberStyles.badgeText, { color: tint }]}>
            {ROLE_LABEL[item.role] ?? item.role}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
}

const createMemberStyles = (colors: ThemeColors) => StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
    marginHorizontal: spacing[4],
    marginBottom: spacing[2],
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.separator.transparent,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  name: {
    ...typography.callout,
    fontWeight: '600',
    color: colors.text.primary,
  },
  email: {
    ...typography.caption1,
    color: colors.text.tertiary,
  },
  badge: {
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing[2],
    paddingVertical: 3,
  },
  badgeText: {
    ...typography.caption2,
    fontWeight: '600',
  },
});

// ─── Screen ───────────────────────────────────────────────────────────────────

function TeamList() {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const onlineCount = TEAM_MEMBERS.filter((u) => u.status === 'online').length;
  const agentCount = TEAM_MEMBERS.filter((u) => u.role === 'agent').length;
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    // Simulate refresh — replace with real API call when available
    await new Promise((r) => setTimeout(r, 800));
    setRefreshing(false);
  }, []);

  function renderItem({ item, index }: ListRenderItemInfo<User>) {
    return <MemberRow item={item} index={index} />;
  }

  return (
    <FlatList
      data={TEAM_MEMBERS}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={colors.accent.primary}
          colors={[colors.accent.primary]}
        />
      }
      ListHeaderComponent={
        <Animated.View entering={FadeInDown.duration(400).delay(100)} style={styles.statsRow}>
          <LinearGradient
            colors={[colors.accent.primary + '15', colors.accent.primary + '05']}
            style={styles.statCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={[styles.statValue, { color: colors.accent.primary }]}>
              {TEAM_MEMBERS.length}
            </Text>
            <Text style={styles.statLabel}>Miembros</Text>
          </LinearGradient>

          <LinearGradient
            colors={[colors.accent.success + '15', colors.accent.success + '05']}
            style={styles.statCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={[styles.statValue, { color: colors.accent.success }]}>
              {onlineCount}
            </Text>
            <Text style={styles.statLabel}>En linea</Text>
          </LinearGradient>

          <LinearGradient
            colors={[colors.accent.info + '15', colors.accent.info + '05']}
            style={styles.statCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={[styles.statValue, { color: colors.accent.info }]}>
              {agentCount}
            </Text>
            <Text style={styles.statLabel}>Agentes</Text>
          </LinearGradient>
        </Animated.View>
      }
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
    />
  );
}

export default function TeamScreen() {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Animated.View entering={FadeInDown.duration(350).delay(50)} style={styles.header}>
        <Text style={styles.title}>Equipo</Text>
      </Animated.View>

      <RoleGate
        minRole="manager"
        fallback={
          <View style={styles.accessDenied}>
            <View style={styles.lockCircle}>
              <MaterialCommunityIcons
                name="lock-outline"
                size={32}
                color={colors.text.tertiary}
              />
            </View>
            <Text style={styles.accessDeniedTitle}>Acceso restringido</Text>
            <Text style={styles.accessDeniedText}>
              Solo gerentes y administradores pueden ver el equipo.
            </Text>
          </View>
        }
      >
        <TeamList />
      </RoleGate>
    </SafeAreaView>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    paddingHorizontal: spacing[4],
    paddingTop: spacing[4],
    paddingBottom: spacing[3],
  },
  title: {
    ...typography.largeTitle,
    fontWeight: '700',
    color: colors.text.primary,
  },

  /* Stats */
  statsRow: {
    flexDirection: 'row',
    gap: spacing[3],
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[4],
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    gap: spacing[1],
    paddingVertical: spacing[4],
    borderRadius: borderRadius.xl,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.separator.transparent,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
  },
  statLabel: {
    ...typography.caption1,
    color: colors.text.secondary,
  },

  listContent: {
    paddingBottom: spacing[24],
  },

  /* Access denied */
  accessDenied: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[3],
    paddingHorizontal: spacing[8],
  },
  lockCircle: {
    width: 72,
    height: 72,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[2],
  },
  accessDeniedTitle: {
    ...typography.headline,
    color: colors.text.primary,
  },
  accessDeniedText: {
    ...typography.subhead,
    color: colors.text.tertiary,
    textAlign: 'center',
  },
});
