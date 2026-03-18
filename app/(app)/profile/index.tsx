import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useShallow } from 'zustand/react/shallow';

import { useAuthStore } from '@/store/useAuthStore';
import { Avatar } from '@/components/ui/Avatar';
import { GlassCard } from '@/components/ui/GlassCard';
import { Pressable } from '@/components/ui/Pressable';
import { colors, spacing, typography, borderRadius } from '@/design';

const ROLE_LABEL: Record<string, string> = {
  agent: 'Agente',
  manager: 'Gerente',
  admin: 'Administrador',
};

const STATUS_LABEL: Record<string, string> = {
  online: 'En línea',
  away: 'Ausente',
  offline: 'Desconectado',
};

export default function ProfileScreen() {
  const { user, signOut } = useAuthStore(
    useShallow((s) => ({ user: s.user, signOut: s.signOut }))
  );

  async function handleSignOut() {
    await signOut();
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Header ─────────────────────────────────────────────────────────── */}
        <Text style={styles.screenTitle}>Perfil</Text>

        {/* ── Identity card ──────────────────────────────────────────────────── */}
        <GlassCard style={styles.identityCard}>
          <Avatar
            name={user?.name ?? '?'}
            uri={user?.avatarUrl}
            size={72}
            status={user?.status}
          />
          <View style={styles.identityText}>
            <Text style={styles.userName}>{user?.name ?? '—'}</Text>
            <Text style={styles.userEmail}>{user?.email ?? '—'}</Text>
            <View style={styles.badgeRow}>
              {user?.role !== undefined && (
                <View style={styles.roleBadge}>
                  <Text style={styles.roleBadgeText}>
                    {ROLE_LABEL[user.role] ?? user.role}
                  </Text>
                </View>
              )}
              {user?.status !== undefined && (
                <View style={[styles.statusDot, { backgroundColor: getStatusColor(user.status) }]} />
              )}
              {user?.status !== undefined && (
                <Text style={styles.statusText}>
                  {STATUS_LABEL[user.status] ?? user.status}
                </Text>
              )}
            </View>
          </View>
        </GlassCard>

        {/* ── Account section ─────────────────────────────────────────────────── */}
        <GlassCard style={styles.section}>
          <Text style={styles.sectionLabel}>Cuenta</Text>

          <SettingsRow
            icon="account-edit-outline"
            label="Editar perfil"
            onPress={() => { /* TODO */ }}
          />
          <View style={styles.rowDivider} />
          <SettingsRow
            icon="bell-outline"
            label="Notificaciones"
            onPress={() => { /* TODO */ }}
          />
          <View style={styles.rowDivider} />
          <SettingsRow
            icon="shield-account-outline"
            label="Privacidad y seguridad"
            onPress={() => { /* TODO */ }}
          />
        </GlassCard>

        {/* ── Sign out ────────────────────────────────────────────────────────── */}
        <Pressable onPress={handleSignOut} style={styles.signOutButton}>
          <MaterialCommunityIcons name="logout" size={20} color={colors.accent.error} />
          <Text style={styles.signOutLabel}>Cerrar sesión</Text>
        </Pressable>

        <Text style={styles.version}>Motomoto v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Settings row ─────────────────────────────────────────────────────────────

interface SettingsRowProps {
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  label: string;
  onPress: () => void;
}

function SettingsRow({ icon, label, onPress }: SettingsRowProps) {
  return (
    <Pressable onPress={onPress} style={rowStyles.row}>
      <MaterialCommunityIcons name={icon} size={20} color={colors.text.secondary} />
      <Text style={rowStyles.label}>{label}</Text>
      <MaterialCommunityIcons name="chevron-right" size={20} color={colors.text.tertiary} />
    </Pressable>
  );
}

const rowStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
  },
  label: {
    flex: 1,
    ...typography.callout,
    color: colors.text.primary,
  },
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getStatusColor(status: string): string {
  if (status === 'online') return colors.status.online;
  if (status === 'away') return colors.status.away;
  return colors.status.offline;
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  scrollContent: {
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[20],
    gap: spacing[4],
  },
  screenTitle: {
    ...typography.largeTitle,
    fontWeight: '700',
    color: colors.text.primary,
    paddingTop: spacing[2],
  },
  identityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[4],
    padding: spacing[4],
  },
  identityText: {
    flex: 1,
    gap: spacing[1],
  },
  userName: {
    ...typography.title3,
    fontWeight: '600',
    color: colors.text.primary,
  },
  userEmail: {
    ...typography.subhead,
    color: colors.text.secondary,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    marginTop: spacing[1],
  },
  roleBadge: {
    backgroundColor: colors.accent.primaryMuted,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing[2],
    paddingVertical: 2,
  },
  roleBadgeText: {
    ...typography.caption2,
    color: colors.accent.primary,
    fontWeight: '600',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: borderRadius.full,
  },
  statusText: {
    ...typography.caption1,
    color: colors.text.secondary,
  },
  section: {
    overflow: 'hidden',
    gap: 0,
  },
  sectionLabel: {
    ...typography.caption1,
    color: colors.text.tertiary,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingHorizontal: spacing[4],
    paddingTop: spacing[3],
    paddingBottom: spacing[1],
  },
  rowDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.separator.transparent,
    marginLeft: spacing[4] + 20 + spacing[3],
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[3],
    backgroundColor: colors.accent.errorMuted,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing[4],
    borderWidth: 1,
    borderColor: colors.accent.error,
  },
  signOutLabel: {
    ...typography.headline,
    color: colors.accent.error,
  },
  version: {
    ...typography.caption1,
    color: colors.text.tertiary,
    textAlign: 'center',
  },
});
