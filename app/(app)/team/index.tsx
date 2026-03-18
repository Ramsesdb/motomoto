import React from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  type ListRenderItemInfo,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { RoleGate } from '@/components/ui/RoleGate';
import { Avatar } from '@/components/ui/Avatar';
import { GlassCard } from '@/components/ui/GlassCard';
import { colors, spacing, typography, borderRadius } from '@/design';
import { MOCK_AGENT, MOCK_MANAGER, MOCK_ADMIN } from '@/mock';
import type { User } from '@/types';

const TEAM_MEMBERS: User[] = [MOCK_MANAGER, MOCK_AGENT, MOCK_ADMIN];

const ROLE_LABEL: Record<string, string> = {
  agent: 'Agente',
  manager: 'Gerente',
  admin: 'Administrador',
};

const ROLE_TINT: Record<string, string> = {
  agent: colors.accent.primary,
  manager: colors.accent.success,
  admin: colors.accent.purple,
};

// ─── Team member row ──────────────────────────────────────────────────────────

function MemberRow({ item }: { item: User }) {
  const tint = ROLE_TINT[item.role] ?? colors.accent.primary;
  return (
    <View style={memberStyles.row}>
      <Avatar name={item.name} uri={item.avatarUrl} size={44} status={item.status} />
      <View style={memberStyles.info}>
        <Text style={memberStyles.name}>{item.name}</Text>
        <Text style={memberStyles.email} numberOfLines={1}>{item.email}</Text>
      </View>
      <View style={[memberStyles.badge, { backgroundColor: tint + '22' }]}>
        <Text style={[memberStyles.badgeText, { color: tint }]}>
          {ROLE_LABEL[item.role] ?? item.role}
        </Text>
      </View>
    </View>
  );
}

const memberStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.separator.transparent,
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
  function renderItem({ item }: ListRenderItemInfo<User>) {
    return <MemberRow item={item} />;
  }

  return (
    <FlatList
      data={TEAM_MEMBERS}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      ListHeaderComponent={
        <GlassCard style={styles.statsCard}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{TEAM_MEMBERS.length}</Text>
            <Text style={styles.statLabel}>Miembros</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statValue}>
              {TEAM_MEMBERS.filter((u) => u.status === 'online').length}
            </Text>
            <Text style={styles.statLabel}>En línea</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statValue}>
              {TEAM_MEMBERS.filter((u) => u.role === 'agent').length}
            </Text>
            <Text style={styles.statLabel}>Agentes</Text>
          </View>
        </GlassCard>
      }
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
    />
  );
}

export default function TeamScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Equipo</Text>
      </View>

      <RoleGate
        minRole="manager"
        fallback={
          <View style={styles.accessDenied}>
            <MaterialCommunityIcons
              name="lock-outline"
              size={48}
              color={colors.text.tertiary}
            />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    paddingHorizontal: spacing[4],
    paddingTop: spacing[2],
    paddingBottom: spacing[3],
  },
  title: {
    ...typography.largeTitle,
    fontWeight: '700',
    color: colors.text.primary,
  },
  statsCard: {
    flexDirection: 'row',
    margin: spacing[4],
    padding: spacing[4],
    gap: spacing[2],
  },
  stat: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
  },
  statLabel: {
    ...typography.caption1,
    color: colors.text.secondary,
  },
  statDivider: {
    width: StyleSheet.hairlineWidth,
    backgroundColor: colors.separator.opaque,
    alignSelf: 'stretch',
  },
  listContent: {
    paddingBottom: spacing[20],
  },
  accessDenied: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[4],
    paddingHorizontal: spacing[8],
  },
  accessDeniedText: {
    ...typography.body,
    color: colors.text.tertiary,
    textAlign: 'center',
  },
});
