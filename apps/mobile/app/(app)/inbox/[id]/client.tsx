import React, { useMemo } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useShallow } from 'zustand/react/shallow';

import { useInboxStore } from '@/store/useInboxStore';
import { Avatar } from '@/components/ui/Avatar';
import { GlassCard } from '@/components/ui/GlassCard';
import { Pressable } from '@/components/ui/Pressable';
import { ChannelBadge } from '@/components/messaging/ChannelBadge';
import { useColors } from '@/hooks/useColors';
import { spacing, typography, borderRadius, type ThemeColors } from '@m2/design';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });
}

const PRIORITY_LABEL: Record<string, string> = {
  low: 'Baja',
  normal: 'Normal',
  high: 'Alta',
  urgent: 'Urgente',
};

function getPriorityColor(colors: ThemeColors): Record<string, string> {
  return {
    low: colors.text.tertiary,
    normal: colors.accent.info,
    high: colors.accent.warning,
    urgent: colors.accent.error,
  };
}

const STATUS_LABEL: Record<string, string> = {
  open: 'Abierta',
  pending: 'Pendiente',
  resolved: 'Resuelta',
  spam: 'Spam',
};

function getScoreColor(colors: ThemeColors, score: number): string {
  if (score >= 0.7) return colors.accent.success;
  if (score >= 0.4) return colors.accent.warning;
  return colors.accent.error;
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function ClientProfileScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const priorityColor = useMemo(() => getPriorityColor(colors), [colors]);

  const conversations = useInboxStore(
    useShallow((s) => s.conversations)
  );

  const conversation = conversations.find((c) => c.id === id);
  const contact = conversation?.contact;
  const aiContext = conversation?.aiContext;

  if (contact === undefined) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.closeButton}>
            <MaterialCommunityIcons name="chevron-down" size={28} color={colors.text.primary} />
          </Pressable>
          <Text style={styles.headerTitle}>Perfil del cliente</Text>
          <View style={styles.closeButton} />
        </View>
        <View style={styles.emptyState}>
          <MaterialCommunityIcons name="account-question-outline" size={48} color={colors.text.tertiary} />
          <Text style={styles.emptyText}>Conversacion no encontrada.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.closeButton}>
          <MaterialCommunityIcons name="chevron-down" size={28} color={colors.text.primary} />
        </Pressable>
        <Text style={styles.headerTitle}>Perfil del cliente</Text>
        <View style={styles.closeButton} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Identity gradient card ───────────────────────────────────────── */}
        <Animated.View entering={FadeInDown.duration(400).delay(50)}>
          <LinearGradient
            colors={[colors.accent.primary + '12', 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.identityGradient}
          >
            <View style={styles.identityContent}>
              <Avatar
                name={contact.name}
                uri={contact.avatarUrl}
                size={80}
              />
              <Text style={styles.contactName}>{contact.name}</Text>

              {conversation !== undefined && (
                <View style={styles.channelPill}>
                  <ChannelBadge channel={conversation.channelType} size={16} />
                  <Text style={styles.channelLabel}>
                    {conversation.channelType.charAt(0).toUpperCase() +
                      conversation.channelType.slice(1)}
                  </Text>
                </View>
              )}
            </View>
          </LinearGradient>
        </Animated.View>

        {/* ── Contact details ──────────────────────────────────────────────── */}
        <Animated.View entering={FadeInDown.duration(400).delay(150)}>
          <SectionHeader icon="card-account-details-outline" title="Datos de contacto" colors={colors} />
          <GlassCard style={styles.card}>
            {contact.phoneNumber !== undefined && (
              <InfoRow icon="phone-outline" label="Telefono" value={contact.phoneNumber} colors={colors} />
            )}
            {contact.email !== undefined && (
              <>
                {contact.phoneNumber !== undefined && <Divider colors={colors} />}
                <InfoRow icon="email-outline" label="Correo" value={contact.email} colors={colors} />
              </>
            )}
            <Divider colors={colors} />
            <InfoRow icon="clock-outline" label="Primer contacto" value={formatDate(contact.firstSeenAt)} colors={colors} />
            <Divider colors={colors} />
            <InfoRow icon="update" label="Ultima actividad" value={formatDate(contact.lastSeenAt)} colors={colors} />
          </GlassCard>
        </Animated.View>

        {/* ── Conversation details ────────────────────────────────────────── */}
        {conversation !== undefined && (
          <Animated.View entering={FadeInDown.duration(400).delay(250)}>
            <SectionHeader icon="message-text-outline" title="Esta conversacion" colors={colors} />
            <GlassCard style={styles.card}>
              <InfoRow
                icon="flag-outline"
                label="Estado"
                value={STATUS_LABEL[conversation.status] ?? conversation.status}
                colors={colors}
              />
              <Divider colors={colors} />
              <InfoRow
                icon="alert-circle-outline"
                label="Prioridad"
                value={PRIORITY_LABEL[conversation.priority] ?? conversation.priority}
                valueColor={priorityColor[conversation.priority]}
                colors={colors}
              />
              {conversation.assignedAgent !== undefined && (
                <>
                  <Divider colors={colors} />
                  <InfoRow
                    icon="account-outline"
                    label="Agente"
                    value={conversation.assignedAgent.name}
                    colors={colors}
                  />
                </>
              )}
              <Divider colors={colors} />
              <InfoRow
                icon="calendar-outline"
                label="Creada"
                value={formatDate(conversation.createdAt)}
                colors={colors}
              />
            </GlassCard>
          </Animated.View>
        )}

        {/* ── AI Context ─────────────────────────────────────────────────── */}
        {aiContext !== undefined && (
          <Animated.View entering={FadeInDown.duration(400).delay(350)}>
            <SectionHeader icon="robot-outline" title="Analisis IA" iconColor={colors.accent.purple} colors={colors} />
            <GlassCard style={styles.card}>
              {aiContext.summary !== undefined && (
                <Text style={styles.aiSummary}>{aiContext.summary}</Text>
              )}

              {aiContext.purchaseIntentScore !== undefined && (
                <View style={styles.scoreSection}>
                  <View style={styles.scoreHeader}>
                    <Text style={styles.scoreLabel}>Intencion de compra</Text>
                    <Text style={[styles.scoreValue, { color: getScoreColor(colors, aiContext.purchaseIntentScore) }]}>
                      {Math.round(aiContext.purchaseIntentScore * 100)}%
                    </Text>
                  </View>
                  <View style={styles.scoreBarTrack}>
                    <Animated.View
                      entering={FadeInDown.duration(600).delay(500)}
                      style={[
                        styles.scoreBarFill,
                        {
                          width: `${Math.round(aiContext.purchaseIntentScore * 100)}%`,
                          backgroundColor: getScoreColor(colors, aiContext.purchaseIntentScore),
                        },
                      ]}
                    />
                  </View>
                </View>
              )}
            </GlassCard>
          </Animated.View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionHeader({
  icon,
  title,
  iconColor,
  colors,
}: {
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  title: string;
  iconColor?: string;
  colors: ThemeColors;
}) {
  const sectionStyles = useMemo(() => createSectionStyles(colors), [colors]);

  return (
    <View style={sectionStyles.header}>
      <View style={[sectionStyles.iconBg, iconColor !== undefined && { backgroundColor: iconColor + '20' }]}>
        <MaterialCommunityIcons name={icon} size={14} color={iconColor ?? colors.text.secondary} />
      </View>
      <Text style={sectionStyles.title}>{title}</Text>
    </View>
  );
}

const createSectionStyles = (colors: ThemeColors) => StyleSheet.create({
  header: {
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
  title: {
    ...typography.caption1,
    color: colors.text.tertiary,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});

interface InfoRowProps {
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  label: string;
  value: string;
  valueColor?: string;
  colors: ThemeColors;
}

function InfoRow({ icon, label, value, valueColor, colors }: InfoRowProps) {
  const infoStyles = useMemo(() => createInfoStyles(colors), [colors]);

  return (
    <View style={infoStyles.row}>
      <MaterialCommunityIcons name={icon} size={16} color={colors.text.tertiary} />
      <Text style={infoStyles.label}>{label}</Text>
      <Text
        style={[infoStyles.value, valueColor !== undefined && { color: valueColor }]}
        numberOfLines={1}
      >
        {value}
      </Text>
    </View>
  );
}

function Divider({ colors }: { colors: ThemeColors }) {
  const infoStyles = useMemo(() => createInfoStyles(colors), [colors]);
  return <View style={infoStyles.divider} />;
}

const createInfoStyles = (colors: ThemeColors) => StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
  },
  label: {
    ...typography.subhead,
    color: colors.text.secondary,
    flex: 1,
  },
  value: {
    ...typography.subhead,
    color: colors.text.primary,
    fontWeight: '500',
    textAlign: 'right',
    flexShrink: 0,
    maxWidth: '50%',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.separator.transparent,
    marginLeft: spacing[4] + 16 + spacing[3],
  },
});

// ─── Styles ──────────────────────────────────────────────────────────────────

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[2],
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.separator.transparent,
  },
  closeButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    ...typography.headline,
    color: colors.text.primary,
    textAlign: 'center',
  },
  scrollContent: {
    padding: spacing[4],
    gap: spacing[5],
    paddingBottom: spacing[12],
  },

  /* Empty state */
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[3],
  },
  emptyText: {
    ...typography.body,
    color: colors.text.tertiary,
    textAlign: 'center',
  },

  /* Identity */
  identityGradient: {
    borderRadius: borderRadius.xl,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.separator.transparent,
    overflow: 'hidden',
  },
  identityContent: {
    alignItems: 'center',
    paddingVertical: spacing[8],
    paddingHorizontal: spacing[4],
    gap: spacing[2],
  },
  contactName: {
    ...typography.title2,
    fontWeight: '700',
    color: colors.text.primary,
    marginTop: spacing[2],
  },
  channelPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
  },
  channelLabel: {
    ...typography.caption1,
    color: colors.text.secondary,
  },

  /* Cards */
  card: {
    overflow: 'hidden',
  },

  /* AI */
  aiSummary: {
    ...typography.subhead,
    color: colors.text.secondary,
    lineHeight: 22,
    padding: spacing[4],
  },
  scoreSection: {
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[4],
    gap: spacing[2],
  },
  scoreHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  scoreLabel: {
    ...typography.footnote,
    color: colors.text.secondary,
  },
  scoreValue: {
    ...typography.footnote,
    fontWeight: '700',
  },
  scoreBarTrack: {
    height: 6,
    backgroundColor: colors.background.elevated,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  scoreBarFill: {
    height: '100%',
    borderRadius: borderRadius.full,
  },
});
