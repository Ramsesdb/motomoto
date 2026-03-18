import React, { useEffect, useMemo } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { RoleGate } from '@/components/ui/RoleGate';
import { GlassCard } from '@/components/ui/GlassCard';
import { useInboxStore } from '@/store/useInboxStore';
import { colors, spacing, typography, borderRadius } from '@/design';

// ─── Metric card ──────────────────────────────────────────────────────────────

interface ReportMetricProps {
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  label: string;
  value: string | number;
  tint: string;
}

function ReportMetric({ icon, label, value, tint }: ReportMetricProps) {
  return (
    <GlassCard style={metricStyles.card}>
      <View style={[metricStyles.iconBg, { backgroundColor: tint + '22' }]}>
        <MaterialCommunityIcons name={icon} size={22} color={tint} />
      </View>
      <Text style={metricStyles.value}>{value}</Text>
      <Text style={metricStyles.label} numberOfLines={2}>{label}</Text>
    </GlassCard>
  );
}

const metricStyles = StyleSheet.create({
  card: {
    width: '47%',
    padding: spacing[4],
    gap: spacing[2],
    minHeight: 110,
  },
  iconBg: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text.primary,
    letterSpacing: -0.5,
  },
  label: {
    ...typography.caption1,
    color: colors.text.secondary,
  },
});

// ─── Reports content ─────────────────────────────────────────────────────────

function ReportsContent() {
  const conversations = useInboxStore((s) => s.conversations);
  const loadConversations = useInboxStore((s) => s.loadConversations);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  const stats = useMemo(() => {
    const total = conversations.length;
    const resolved = conversations.filter((c) => c.status === 'resolved').length;
    const open = conversations.filter((c) => c.status === 'open').length;
    const pending = conversations.filter((c) => c.status === 'pending').length;
    const highPriority = conversations.filter(
      (c) => c.priority === 'high' || c.priority === 'urgent'
    ).length;
    const withAI = conversations.filter((c) => c.aiContext !== undefined).length;
    return { total, resolved, open, pending, highPriority, withAI };
  }, [conversations]);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      <Text style={styles.periodLabel}>Periodo actual · Todos los datos</Text>

      <View style={styles.grid}>
        <ReportMetric
          icon="message-text-outline"
          label="Total conversaciones"
          value={stats.total}
          tint={colors.accent.primary}
        />
        <ReportMetric
          icon="check-circle-outline"
          label="Conversaciones resueltas"
          value={stats.resolved}
          tint={colors.accent.success}
        />
        <ReportMetric
          icon="message-outline"
          label="Abiertas actualmente"
          value={stats.open}
          tint={colors.accent.info}
        />
        <ReportMetric
          icon="clock-outline"
          label="Pendientes de respuesta"
          value={stats.pending}
          tint={colors.accent.warning}
        />
        <ReportMetric
          icon="alert-circle-outline"
          label="Alta prioridad"
          value={stats.highPriority}
          tint={colors.accent.error}
        />
        <ReportMetric
          icon="robot-outline"
          label="Analizadas por IA"
          value={stats.withAI}
          tint={colors.accent.purple}
        />
      </View>

      <GlassCard style={styles.placeholderCard}>
        <MaterialCommunityIcons name="chart-line" size={40} color={colors.text.tertiary} />
        <Text style={styles.placeholderTitle}>Gráficas avanzadas</Text>
        <Text style={styles.placeholderDesc}>
          Los gráficos de tendencias, tiempos de respuesta y satisfacción del cliente estarán disponibles próximamente.
        </Text>
      </GlassCard>
    </ScrollView>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function ReportsScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Reportes</Text>
      </View>

      <RoleGate
        minRole="manager"
        fallback={
          <View style={styles.accessDenied}>
            <MaterialCommunityIcons name="lock-outline" size={48} color={colors.text.tertiary} />
            <Text style={styles.accessDeniedText}>
              Solo gerentes y administradores pueden ver los reportes.
            </Text>
          </View>
        }
      >
        <ReportsContent />
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
  periodLabel: {
    ...typography.footnote,
    color: colors.text.tertiary,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[3],
  },
  placeholderCard: {
    alignItems: 'center',
    padding: spacing[8],
    gap: spacing[3],
  },
  placeholderTitle: {
    ...typography.title3,
    fontWeight: '600',
    color: colors.text.primary,
  },
  placeholderDesc: {
    ...typography.subhead,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
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
