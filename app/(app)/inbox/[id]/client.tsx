import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useShallow } from 'zustand/react/shallow';

import { useInboxStore } from '@/store/useInboxStore';
import { Avatar } from '@/components/ui/Avatar';
import { GlassCard } from '@/components/ui/GlassCard';
import { ChannelBadge } from '@/components/messaging/ChannelBadge';
import { colors, spacing, typography, borderRadius } from '@/design';

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

const STATUS_LABEL: Record<string, string> = {
  open: 'Abierta',
  pending: 'Pendiente',
  resolved: 'Resuelta',
  spam: 'Spam',
};

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function ClientProfileScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const conversations = useInboxStore(
    useShallow((s) => s.conversations)
  );

  const conversation = conversations.find((c) => c.id === id);
  const contact = conversation?.contact;
  const aiContext = conversation?.aiContext;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* ── Header ───────────────────────────────────────────────────────────── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeButton} activeOpacity={0.7}>
          <MaterialCommunityIcons
            name="chevron-down"
            size={28}
            color={colors.text.primary}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Perfil del cliente</Text>
        <View style={styles.closeButton} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {contact === undefined ? (
          <Text style={styles.notFound}>Conversación no encontrada.</Text>
        ) : (
          <>
            {/* ── Identity ─────────────────────────────────────────────────── */}
            <View style={styles.identitySection}>
              <Avatar
                name={contact.name}
                uri={contact.avatarUrl}
                size={72}
              />
              <Text style={styles.contactName}>{contact.name}</Text>

              {conversation !== undefined && (
                <View style={styles.channelRow}>
                  <ChannelBadge channel={conversation.channelType} size={20} />
                  <Text style={styles.channelLabel}>
                    {conversation.channelType.charAt(0).toUpperCase() +
                      conversation.channelType.slice(1)}
                  </Text>
                </View>
              )}
            </View>

            {/* ── Contact details ──────────────────────────────────────────── */}
            <GlassCard style={styles.card}>
              <Text style={styles.sectionTitle}>Datos de contacto</Text>

              {contact.phoneNumber !== undefined && (
                <InfoRow
                  icon="phone-outline"
                  label="Teléfono"
                  value={contact.phoneNumber}
                />
              )}
              {contact.email !== undefined && (
                <InfoRow
                  icon="email-outline"
                  label="Correo"
                  value={contact.email}
                />
              )}
              <InfoRow
                icon="clock-outline"
                label="Primer contacto"
                value={formatDate(contact.firstSeenAt)}
              />
              <InfoRow
                icon="update"
                label="Última actividad"
                value={formatDate(contact.lastSeenAt)}
              />
            </GlassCard>

            {/* ── Conversation details ──────────────────────────────────────── */}
            {conversation !== undefined && (
              <GlassCard style={styles.card}>
                <Text style={styles.sectionTitle}>Esta conversación</Text>
                <InfoRow
                  icon="flag-outline"
                  label="Estado"
                  value={STATUS_LABEL[conversation.status] ?? conversation.status}
                />
                <InfoRow
                  icon="alert-circle-outline"
                  label="Prioridad"
                  value={PRIORITY_LABEL[conversation.priority] ?? conversation.priority}
                />
                {conversation.assignedAgent !== undefined && (
                  <InfoRow
                    icon="account-outline"
                    label="Agente asignado"
                    value={conversation.assignedAgent.name}
                  />
                )}
                <InfoRow
                  icon="calendar-outline"
                  label="Creada"
                  value={formatDate(conversation.createdAt)}
                />
              </GlassCard>
            )}

            {/* ── AI Context ───────────────────────────────────────────────── */}
            {aiContext !== undefined && (
              <GlassCard style={styles.card}>
                <View style={styles.aiHeader}>
                  <MaterialCommunityIcons
                    name="robot-outline"
                    size={16}
                    color={colors.accent.purple}
                  />
                  <Text style={styles.sectionTitle}>Análisis IA</Text>
                </View>

                {aiContext.summary !== undefined && (
                  <Text style={styles.aiSummary}>{aiContext.summary}</Text>
                )}

                {aiContext.purchaseIntentScore !== undefined && (
                  <View style={styles.scoreRow}>
                    <Text style={styles.scoreLabel}>Intención de compra</Text>
                    <View style={styles.scoreBarTrack}>
                      <View
                        style={[
                          styles.scoreBarFill,
                          { width: `${Math.round(aiContext.purchaseIntentScore * 100)}%` },
                        ]}
                      />
                    </View>
                    <Text style={styles.scoreValue}>
                      {Math.round(aiContext.purchaseIntentScore * 100)}%
                    </Text>
                  </View>
                )}
              </GlassCard>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface InfoRowProps {
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  label: string;
  value: string;
}

function InfoRow({ icon, label, value }: InfoRowProps) {
  return (
    <View style={infoStyles.row}>
      <MaterialCommunityIcons name={icon} size={16} color={colors.text.tertiary} />
      <Text style={infoStyles.label}>{label}</Text>
      <Text style={infoStyles.value} numberOfLines={1}>{value}</Text>
    </View>
  );
}

const infoStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    paddingVertical: spacing[2],
  },
  label: {
    ...typography.footnote,
    color: colors.text.secondary,
    width: 110,
    flexShrink: 0,
  },
  value: {
    flex: 1,
    ...typography.footnote,
    color: colors.text.primary,
    textAlign: 'right',
  },
});

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
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
    gap: spacing[4],
    paddingBottom: spacing[12],
  },
  notFound: {
    ...typography.body,
    color: colors.text.tertiary,
    textAlign: 'center',
    marginTop: spacing[8],
  },
  identitySection: {
    alignItems: 'center',
    gap: spacing[3],
    paddingVertical: spacing[4],
  },
  contactName: {
    ...typography.title2,
    fontWeight: '600',
    color: colors.text.primary,
  },
  channelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  channelLabel: {
    ...typography.footnote,
    color: colors.text.secondary,
  },
  card: {
    padding: spacing[4],
    gap: spacing[1],
  },
  sectionTitle: {
    ...typography.footnote,
    color: colors.text.tertiary,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing[1],
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    marginBottom: spacing[2],
  },
  aiSummary: {
    ...typography.subhead,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    marginTop: spacing[3],
  },
  scoreLabel: {
    ...typography.footnote,
    color: colors.text.secondary,
    width: 120,
    flexShrink: 0,
  },
  scoreBarTrack: {
    flex: 1,
    height: 6,
    backgroundColor: colors.background.elevated,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  scoreBarFill: {
    height: '100%',
    backgroundColor: colors.accent.success,
    borderRadius: borderRadius.full,
  },
  scoreValue: {
    ...typography.footnote,
    color: colors.accent.success,
    fontWeight: '600',
    width: 36,
    textAlign: 'right',
  },
});
