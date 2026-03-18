import React, { useMemo } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useShallow } from 'zustand/react/shallow';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { useAuthStore } from '@/store/useAuthStore';
import { useThemeStore, type ThemePreference } from '@/store/useThemeStore';
import { Avatar } from '@/components/ui/Avatar';
import { GlassCard } from '@/components/ui/GlassCard';
import { Pressable } from '@/components/ui/Pressable';
import { spacing, typography, borderRadius } from '@/design';
import type { ThemeColors } from '@/design';
import { useColors } from '@/hooks/useColors';

const ROLE_LABEL: Record<string, string> = {
  agent: 'Agente',
  manager: 'Gerente',
  admin: 'Administrador',
};

const STATUS_LABEL: Record<string, string> = {
  online: 'En linea',
  away: 'Ausente',
  offline: 'Desconectado',
};

export default function ProfileScreen() {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const rStyles = useMemo(() => createRowStyles(colors), [colors]);

  const { user, signOut } = useAuthStore(
    useShallow((s) => ({ user: s.user, signOut: s.signOut }))
  );
  const themePreference = useThemeStore((s) => s.preference);
  const setThemePreference = useThemeStore((s) => s.setPreference);

  const THEME_LABELS: Record<ThemePreference, string> = {
    system: 'Sistema',
    light: 'Claro',
    dark: 'Oscuro',
  };

  const THEME_ORDER: ThemePreference[] = ['system', 'light', 'dark'];

  function cycleTheme() {
    const currentIndex = THEME_ORDER.indexOf(themePreference);
    const next = THEME_ORDER[(currentIndex + 1) % THEME_ORDER.length];
    if (next !== undefined) {
      void setThemePreference(next);
    }
  }

  function getStatusColor(status: string): string {
    if (status === 'online') return colors.status.online;
    if (status === 'away') return colors.status.away;
    return colors.status.offline;
  }

  async function handleSignOut() {
    await signOut();
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* -- Header --------------------------------------------------------- */}
        <Animated.View entering={FadeInDown.duration(400).delay(50)}>
          <Text style={styles.screenTitle}>Perfil</Text>
        </Animated.View>

        {/* -- Identity card -------------------------------------------------- */}
        <Animated.View entering={FadeInDown.duration(400).delay(120)}>
          <LinearGradient
            colors={[colors.accent.primary + '12', 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.identityGradient}
          >
            <View style={styles.identityCard}>
              <Avatar
                name={user?.name ?? '?'}
                uri={user?.avatarUrl}
                size={80}
                status={user?.status}
              />
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
                  <View style={styles.statusPill}>
                    <View style={[styles.statusDot, { backgroundColor: getStatusColor(user.status) }]} />
                    <Text style={styles.statusText}>
                      {STATUS_LABEL[user.status] ?? user.status}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* -- Account section ------------------------------------------------ */}
        <Animated.View entering={FadeInDown.duration(400).delay(240)}>
          <Text style={styles.sectionLabel}>CUENTA</Text>
          <GlassCard style={styles.section}>
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
        </Animated.View>

        {/* -- Preferences section -------------------------------------------- */}
        <Animated.View entering={FadeInDown.duration(400).delay(340)}>
          <Text style={styles.sectionLabel}>PREFERENCIAS</Text>
          <GlassCard style={styles.section}>
            <SettingsRow
              icon="theme-light-dark"
              label="Tema"
              value={THEME_LABELS[themePreference]}
              onPress={cycleTheme}
            />
            <View style={styles.rowDivider} />
            <SettingsRow
              icon="translate"
              label="Idioma"
              value="Español"
              onPress={() => { /* TODO */ }}
            />
            <View style={styles.rowDivider} />
            <SettingsRow
              icon="information-outline"
              label="Acerca de"
              value="v1.0.0"
              onPress={() => { /* TODO */ }}
            />
          </GlassCard>
        </Animated.View>

        {/* -- Sign out ------------------------------------------------------- */}
        <Animated.View entering={FadeInDown.duration(400).delay(440)}>
          <Pressable onPress={handleSignOut} style={styles.signOutButton}>
            <MaterialCommunityIcons name="logout" size={18} color={colors.accent.error} />
            <Text style={styles.signOutLabel}>Cerrar sesion</Text>
          </Pressable>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

// --- Settings row -----------------------------------------------------------

interface SettingsRowProps {
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  label: string;
  value?: string;
  onPress: () => void;
}

function SettingsRow({ icon, label, value, onPress }: SettingsRowProps) {
  const colors = useColors();
  const rowStyles = useMemo(() => createRowStyles(colors), [colors]);

  return (
    <Pressable onPress={onPress} style={rowStyles.row}>
      <View style={rowStyles.iconCircle}>
        <MaterialCommunityIcons name={icon} size={18} color={colors.text.secondary} />
      </View>
      <Text style={rowStyles.label}>{label}</Text>
      {value !== undefined && (
        <Text style={rowStyles.value}>{value}</Text>
      )}
      <MaterialCommunityIcons name="chevron-right" size={18} color={colors.text.tertiary} />
    </Pressable>
  );
}

const createRowStyles = (colors: ThemeColors) => StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
    minHeight: 48,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background.elevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    flex: 1,
    ...typography.callout,
    color: colors.text.primary,
  },
  value: {
    ...typography.subhead,
    color: colors.text.tertiary,
  },
});

// --- Styles -----------------------------------------------------------------

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  scrollContent: {
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[24],
    gap: spacing[4],
  },
  screenTitle: {
    ...typography.largeTitle,
    fontWeight: '700',
    color: colors.text.primary,
    paddingTop: spacing[4],
  },

  /* Identity */
  identityGradient: {
    borderRadius: borderRadius.xl,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.separator.transparent,
    overflow: 'hidden',
  },
  identityCard: {
    alignItems: 'center',
    paddingVertical: spacing[8],
    paddingHorizontal: spacing[4],
    gap: spacing[2],
  },
  userName: {
    ...typography.title2,
    fontWeight: '700',
    color: colors.text.primary,
    marginTop: spacing[2],
  },
  userEmail: {
    ...typography.subhead,
    color: colors.text.secondary,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    marginTop: spacing[2],
  },
  roleBadge: {
    backgroundColor: colors.accent.primaryMuted,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
  },
  roleBadgeText: {
    ...typography.caption1,
    color: colors.accent.primary,
    fontWeight: '600',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
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

  /* Sections */
  sectionLabel: {
    ...typography.caption1,
    color: colors.text.tertiary,
    fontWeight: '600',
    letterSpacing: 0.8,
    marginBottom: -spacing[2],
    paddingLeft: spacing[1],
  },
  section: {
    overflow: 'hidden',
    gap: 0,
  },
  rowDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.separator.transparent,
    marginLeft: spacing[4] + 32 + spacing[3],
  },

  /* Sign out */
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
    paddingVertical: spacing[4],
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.accent.error + '30',
    backgroundColor: colors.accent.errorMuted,
  },
  signOutLabel: {
    ...typography.callout,
    fontWeight: '600',
    color: colors.accent.error,
  },
});
