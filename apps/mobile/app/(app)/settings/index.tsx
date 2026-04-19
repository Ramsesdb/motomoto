import React, { useMemo } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { RoleGate } from '@/components/ui/RoleGate';
import { GlassCard } from '@/components/ui/GlassCard';
import { Pressable } from '@/components/ui/Pressable';
import { spacing, typography, borderRadius } from '@m2/design';
import type { ThemeColors } from '@m2/design';
import { useColors } from '@/hooks/useColors';

// --- Setting row ------------------------------------------------------------

interface SettingRowProps {
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  iconColor?: string;
  iconBg?: string;
  label: string;
  description?: string;
  onPress: () => void;
  destructive?: boolean;
}

function SettingRow({
  icon,
  iconColor,
  iconBg,
  label,
  description,
  onPress,
  destructive = false,
}: SettingRowProps) {
  const colors = useColors();
  const sStyles = useMemo(() => createSettingStyles(colors), [colors]);

  const resolvedIconColor = destructive
    ? colors.accent.error
    : (iconColor ?? colors.text.secondary);
  const resolvedIconBg = destructive
    ? colors.accent.errorMuted
    : (iconBg ?? colors.background.elevated);
  const textColor = destructive ? colors.accent.error : colors.text.primary;

  return (
    <Pressable onPress={onPress} style={sStyles.row}>
      <View style={[sStyles.iconCircle, { backgroundColor: resolvedIconBg }]}>
        <MaterialCommunityIcons name={icon} size={18} color={resolvedIconColor} />
      </View>
      <View style={sStyles.rowText}>
        <Text style={[sStyles.label, { color: textColor }]}>{label}</Text>
        {description !== undefined && (
          <Text style={sStyles.desc} numberOfLines={1}>{description}</Text>
        )}
      </View>
      <MaterialCommunityIcons name="chevron-right" size={18} color={colors.text.tertiary} />
    </Pressable>
  );
}

const createSettingStyles = (colors: ThemeColors) => StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
    minHeight: 52,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowText: {
    flex: 1,
    gap: 2,
  },
  label: {
    ...typography.callout,
  },
  desc: {
    ...typography.caption1,
    color: colors.text.tertiary,
  },
});

// --- Section header ---------------------------------------------------------

function SectionHeader({
  icon,
  title,
  iconColor,
}: {
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  title: string;
  iconColor?: string;
}) {
  const colors = useColors();
  const hStyles = useMemo(() => createHeaderStyles(colors), [colors]);

  return (
    <View style={hStyles.container}>
      <View style={[hStyles.iconBg, iconColor !== undefined && { backgroundColor: iconColor + '20' }]}>
        <MaterialCommunityIcons name={icon} size={14} color={iconColor ?? colors.text.secondary} />
      </View>
      <Text style={hStyles.label}>{title}</Text>
    </View>
  );
}

const createHeaderStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    marginBottom: spacing[2],
    paddingLeft: spacing[1],
  },
  iconBg: {
    width: 24,
    height: 24,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.background.elevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    ...typography.caption1,
    color: colors.text.tertiary,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});

// --- Settings content -------------------------------------------------------

function SettingsContent() {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  function handleDeleteOrg() {
    Alert.alert(
      'Eliminar organización',
      '¿Estás seguro? Esta acción es irreversible y eliminará todos los datos de la organización.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: () => { /* TODO */ } },
      ],
    );
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
      {/* -- Organización --------------------------------------------------- */}
      <Animated.View entering={FadeInDown.duration(400).delay(50)}>
        <SectionHeader icon="domain" title="Organización" iconColor={colors.accent.primary} />
        <GlassCard style={styles.section}>
          <SettingRow
            icon="domain"
            iconColor={colors.accent.primary}
            iconBg={colors.accent.primaryMuted}
            label="Datos de la empresa"
            description="Nombre, logo, zona horaria"
            onPress={() => { /* TODO */ }}
          />
          <View style={styles.divider} />
          <SettingRow
            icon="account-multiple-outline"
            iconColor={colors.accent.info}
            iconBg={colors.accent.infoMuted}
            label="Gestión de roles"
            description="Permisos por rol de usuario"
            onPress={() => { /* TODO */ }}
          />
          <View style={styles.divider} />
          <SettingRow
            icon="calendar-clock"
            iconColor={colors.accent.warning}
            iconBg={colors.accent.warningMuted}
            label="Horarios de atención"
            description="Define franjas horarias de respuesta"
            onPress={() => { /* TODO */ }}
          />
        </GlassCard>
      </Animated.View>

      {/* -- Canales -------------------------------------------------------- */}
      <Animated.View entering={FadeInDown.duration(400).delay(150)}>
        <SectionHeader icon="message-text-outline" title="Canales" iconColor={colors.accent.success} />
        <GlassCard style={styles.section}>
          <SettingRow
            icon="whatsapp"
            iconColor={colors.channel.whatsapp}
            iconBg={colors.accent.successMuted}
            label="WhatsApp Business"
            description="Configurar API y número"
            onPress={() => { /* TODO */ }}
          />
          <View style={styles.divider} />
          <SettingRow
            icon="instagram"
            iconColor={colors.channel.instagram}
            iconBg={colors.accent.errorMuted}
            label="Instagram"
            description="Conectar cuenta comercial"
            onPress={() => { /* TODO */ }}
          />
          <View style={styles.divider} />
          <SettingRow
            icon="email-outline"
            iconColor={colors.accent.primary}
            iconBg={colors.accent.primaryMuted}
            label="Correo electrónico"
            description="IMAP / SMTP"
            onPress={() => { /* TODO */ }}
          />
        </GlassCard>
      </Animated.View>

      {/* -- IA & Automatización --------------------------------------------- */}
      <Animated.View entering={FadeInDown.duration(400).delay(250)}>
        <SectionHeader icon="robot-outline" title="IA y automatización" iconColor={colors.accent.purple} />
        <GlassCard style={styles.section}>
          <SettingRow
            icon="robot-outline"
            iconColor={colors.accent.purple}
            iconBg={colors.accent.purpleMuted}
            label="Modelo de IA"
            description="Proveedor y configuración"
            onPress={() => { /* TODO */ }}
          />
          <View style={styles.divider} />
          <SettingRow
            icon="message-cog-outline"
            iconColor={colors.accent.info}
            iconBg={colors.accent.infoMuted}
            label="Respuestas automáticas"
            description="Plantillas y condiciones de disparo"
            onPress={() => { /* TODO */ }}
          />
        </GlassCard>
      </Animated.View>

      {/* -- Avanzado ------------------------------------------------------- */}
      <Animated.View entering={FadeInDown.duration(400).delay(350)}>
        <SectionHeader icon="cog-outline" title="Avanzado" iconColor={colors.text.secondary} />
        <GlassCard style={styles.section}>
          <SettingRow
            icon="webhook"
            label="Webhooks"
            description="Endpoints de eventos"
            onPress={() => { /* TODO */ }}
          />
          <View style={styles.divider} />
          <SettingRow
            icon="api"
            label="API Keys"
            description="Claves de acceso a la API"
            onPress={() => { /* TODO */ }}
          />
          <View style={styles.divider} />
          <SettingRow
            icon="delete-outline"
            label="Eliminar organización"
            destructive
            onPress={handleDeleteOrg}
          />
        </GlassCard>
      </Animated.View>
    </ScrollView>
  );
}

// --- Screen -----------------------------------------------------------------

export default function SettingsScreen() {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Animated.View entering={FadeInDown.duration(400).delay(0)} style={styles.header}>
        <Text style={styles.title}>Ajustes</Text>
      </Animated.View>

      <RoleGate
        minRole="admin"
        fallback={
          <View style={styles.accessDenied}>
            <MaterialCommunityIcons name="lock-outline" size={48} color={colors.text.tertiary} />
            <Text style={styles.accessDeniedText}>
              Solo administradores pueden acceder a los ajustes.
            </Text>
          </View>
        }
      >
        <SettingsContent />
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
    paddingTop: spacing[2],
    paddingBottom: spacing[3],
  },
  title: {
    ...typography.largeTitle,
    fontWeight: '700',
    color: colors.text.primary,
  },
  scrollContent: {
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[20],
    gap: spacing[5],
  },
  section: {
    overflow: 'hidden',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.separator.transparent,
    marginLeft: spacing[4] + 32 + spacing[3],
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
