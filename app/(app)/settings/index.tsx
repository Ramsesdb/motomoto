import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { RoleGate } from '@/components/ui/RoleGate';
import { GlassCard } from '@/components/ui/GlassCard';
import { colors, spacing, typography } from '@/design';

// ─── Setting row ──────────────────────────────────────────────────────────────

interface SettingRowProps {
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  label: string;
  description?: string;
  onPress: () => void;
  destructive?: boolean;
}

function SettingRow({ icon, label, description, onPress, destructive = false }: SettingRowProps) {
  const textColor = destructive ? colors.accent.error : colors.text.primary;
  const iconColor = destructive ? colors.accent.error : colors.text.secondary;
  return (
    <TouchableOpacity onPress={onPress} style={settingStyles.row} activeOpacity={0.7}>
      <MaterialCommunityIcons name={icon} size={20} color={iconColor} />
      <View style={settingStyles.rowText}>
        <Text style={[settingStyles.label, { color: textColor }]}>{label}</Text>
        {description !== undefined && (
          <Text style={settingStyles.desc} numberOfLines={1}>{description}</Text>
        )}
      </View>
      <MaterialCommunityIcons name="chevron-right" size={20} color={colors.text.tertiary} />
    </TouchableOpacity>
  );
}

const settingStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
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

// ─── Settings content ─────────────────────────────────────────────────────────

function SettingsContent() {
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

      {/* ── Organización ─────────────────────────────────────────────────────── */}
      <GlassCard style={styles.section}>
        <Text style={styles.sectionLabel}>Organización</Text>
        <SettingRow
          icon="domain"
          label="Datos de la empresa"
          description="Nombre, logo, zona horaria"
          onPress={() => { /* TODO */ }}
        />
        <View style={styles.divider} />
        <SettingRow
          icon="account-multiple-outline"
          label="Gestión de roles"
          description="Permisos por rol de usuario"
          onPress={() => { /* TODO */ }}
        />
        <View style={styles.divider} />
        <SettingRow
          icon="calendar-clock"
          label="Horarios de atención"
          description="Define franjas horarias de respuesta"
          onPress={() => { /* TODO */ }}
        />
      </GlassCard>

      {/* ── Canales ──────────────────────────────────────────────────────────── */}
      <GlassCard style={styles.section}>
        <Text style={styles.sectionLabel}>Canales</Text>
        <SettingRow
          icon="whatsapp"
          label="WhatsApp Business"
          description="Configurar API y número"
          onPress={() => { /* TODO */ }}
        />
        <View style={styles.divider} />
        <SettingRow
          icon="instagram"
          label="Instagram"
          description="Conectar cuenta comercial"
          onPress={() => { /* TODO */ }}
        />
        <View style={styles.divider} />
        <SettingRow
          icon="email-outline"
          label="Correo electrónico"
          description="IMAP / SMTP"
          onPress={() => { /* TODO */ }}
        />
      </GlassCard>

      {/* ── IA & Automatización ──────────────────────────────────────────────── */}
      <GlassCard style={styles.section}>
        <Text style={styles.sectionLabel}>IA y automatización</Text>
        <SettingRow
          icon="robot-outline"
          label="Modelo de IA"
          description="Proveedor y configuración"
          onPress={() => { /* TODO */ }}
        />
        <View style={styles.divider} />
        <SettingRow
          icon="message-cog-outline"
          label="Respuestas automáticas"
          description="Plantillas y condiciones de disparo"
          onPress={() => { /* TODO */ }}
        />
      </GlassCard>

      {/* ── Avanzado ─────────────────────────────────────────────────────────── */}
      <GlassCard style={styles.section}>
        <Text style={styles.sectionLabel}>Avanzado</Text>
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
          onPress={() => { /* TODO */ }}
        />
      </GlassCard>
    </ScrollView>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function SettingsScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Ajustes</Text>
      </View>

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
  scrollContent: {
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[20],
    gap: spacing[4],
  },
  section: {
    overflow: 'hidden',
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
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.separator.transparent,
    marginLeft: spacing[4] + 20 + spacing[3],
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
