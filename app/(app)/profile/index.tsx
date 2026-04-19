import React, { useMemo } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useShallow } from 'zustand/react/shallow';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { useAuthStore } from '@/store/useAuthStore';
import { useRole } from '@/hooks/useRole';
import { useThemeStore, type ThemePreference } from '@/store/useThemeStore';
import { Avatar } from '@/components/ui/Avatar';
import { GlassCard } from '@/components/ui/GlassCard';
import { Pressable } from '@/components/ui/Pressable';
import { spacing, borderRadius } from '@/design';
import { fontFamily, typography } from '@/design/typography';
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
  const router = useRouter();
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const rStyles = useMemo(() => createRowStyles(colors), [colors]);
  const isManager = useRole('manager');
  const isAdmin = useRole('admin');

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

  async function handleSignOut() {
    await signOut();
  }

  const roleLabel = user?.role !== undefined ? (ROLE_LABEL[user.role] ?? user.role) : '';
  const statusLabel = user?.status !== undefined ? (STATUS_LABEL[user.status] ?? user.status) : '';
  const roleStatusLine = [roleLabel, statusLabel].filter(Boolean).join(' - ');

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* -- Header --------------------------------------------------------- */}
        <Animated.View entering={FadeInDown.duration(200).delay(50)}>
          <Text style={styles.screenTitle}>Perfil</Text>
        </Animated.View>

        {/* -- Identity card -------------------------------------------------- */}
        <Animated.View entering={FadeInDown.duration(200).delay(120)}>
          <LinearGradient
            colors={[colors.primary + '12', 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.identityGradient}
          >
            <View style={styles.identityCard}>
              <Pressable onPress={() => { /* TODO: image picker */ }} style={styles.avatarWrapper}>
                <Avatar
                  name={user?.name ?? '?'}
                  uri={user?.avatarUrl}
                  size={96}
                  status={user?.status}
                />
                <View style={styles.cameraOverlay}>
                  <MaterialCommunityIcons name="camera" size={14} color={colors.onPrimary} />
                </View>
              </Pressable>
              <Text style={styles.userName}>{user?.name ?? '\u2014'}</Text>
              <Text style={styles.userEmail}>{user?.email ?? '\u2014'}</Text>
              {roleStatusLine.length > 0 && (
                <Text style={styles.roleStatusLine}>{roleStatusLine}</Text>
              )}
            </View>
          </LinearGradient>
        </Animated.View>

        {/* -- Account section ------------------------------------------------ */}
        <Animated.View entering={FadeInDown.duration(200).delay(150)}>
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
              label="Privacidad"
              onPress={() => { /* TODO */ }}
            />
          </GlassCard>
        </Animated.View>

        {/* -- Management section (role-gated) -------------------------------- */}
        {isManager && (
          <Animated.View entering={FadeInDown.duration(200).delay(200)}>
            <Text style={styles.sectionLabel}>GESTION</Text>
            <GlassCard style={styles.section}>
              <SettingsRow
                icon="account-group-outline"
                label="Equipo"
                onPress={() => router.push('/team' as never)}
              />
              <View style={styles.rowDivider} />
              <SettingsRow
                icon="cog-outline"
                label="Configuracion de organizacion"
                onPress={() => router.push('/settings' as never)}
              />
            </GlassCard>
          </Animated.View>
        )}

        {/* -- Preferences section -------------------------------------------- */}
        <Animated.View entering={FadeInDown.duration(200).delay(340)}>
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
              value="Espanol"
              onPress={() => { /* TODO */ }}
            />
            <View style={styles.rowDivider} />
            <SettingsRow
              icon="information-outline"
              label="Acerca de"
              onPress={() => { /* TODO */ }}
            />
            <View style={styles.rowDivider} />
            <SettingsRow
              icon="logout"
              label="Cerrar sesion"
              labelColor={colors.error}
              onPress={handleSignOut}
            />
          </GlassCard>
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
  labelColor?: string;
  onPress: () => void;
}

function SettingsRow({ icon, label, value, labelColor, onPress }: SettingsRowProps) {
  const colors = useColors();
  const rowStyles = useMemo(() => createRowStyles(colors), [colors]);

  return (
    <Pressable onPress={onPress} style={rowStyles.row}>
      <View style={rowStyles.iconCircle}>
        <MaterialCommunityIcons
          name={icon}
          size={18}
          color={labelColor ?? colors.onSurfaceVariant}
        />
      </View>
      <Text style={[rowStyles.label, labelColor !== undefined ? { color: labelColor } : undefined]}>
        {label}
      </Text>
      {value !== undefined && (
        <Text style={rowStyles.value}>{value}</Text>
      )}
      <MaterialCommunityIcons name="chevron-right" size={18} color={colors.onSurfaceVariant} />
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
    backgroundColor: colors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    flex: 1,
    fontFamily: fontFamily.bodyRegular,
    ...typography.callout,
    color: colors.onSurface,
  },
  value: {
    fontFamily: fontFamily.bodyRegular,
    ...typography.subhead,
    color: colors.onSurfaceVariant,
  },
});

// --- Styles -----------------------------------------------------------------

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surfaceBackground,
  },
  scrollContent: {
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[24],
    gap: spacing[4],
  },
  screenTitle: {
    fontFamily: fontFamily.displayBold,
    ...typography.largeTitle,
    fontWeight: '700',
    color: colors.onSurface,
    paddingTop: spacing[4],
  },

  /* Identity */
  identityGradient: {
    borderRadius: borderRadius.xl,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.outlineVariant,
    overflow: 'hidden',
  },
  identityCard: {
    alignItems: 'center',
    paddingVertical: spacing[8],
    paddingHorizontal: spacing[4],
    gap: spacing[2],
  },
  avatarWrapper: {
    position: 'relative',
  },
  cameraOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.surfaceBackground,
  },
  userName: {
    fontFamily: fontFamily.displayBold,
    ...typography.title2,
    fontWeight: '700',
    color: colors.onSurface,
    marginTop: spacing[2],
  },
  userEmail: {
    fontFamily: fontFamily.bodyRegular,
    ...typography.subhead,
    color: colors.onSurfaceVariant,
  },
  roleStatusLine: {
    fontFamily: fontFamily.bodyRegular,
    ...typography.caption1,
    color: colors.onSurfaceVariant,
    marginTop: spacing[1],
  },

  /* Sections */
  sectionLabel: {
    fontFamily: fontFamily.bodyRegular,
    ...typography.caption1,
    color: colors.onSurfaceVariant,
    fontWeight: '600',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: spacing[2],
    paddingLeft: spacing[1],
  },
  section: {
    overflow: 'hidden',
    gap: 0,
  },
  rowDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.outlineVariant,
    marginLeft: spacing[4] + 32 + spacing[3],
  },
});
