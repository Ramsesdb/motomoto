import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { RoleGate } from '@/components/ui/RoleGate';
import { GlassCard } from '@/components/ui/GlassCard';
import { useInboxStore } from '@/store/useInboxStore';
import { useColors } from '@/hooks/useColors';
import { spacing, typography, borderRadius, type ThemeColors } from '@/design';

// ─── Metric card ──────────────────────────────────────────────────────────────

interface ReportMetricProps {
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  label: string;
  value: string | number;
  tint: string;
  gradientEnd: string;
  trend?: { direction: 'up' | 'down'; percent: number };
  index: number;
}

function ReportMetric({ icon, label, value, tint, gradientEnd, trend, index }: ReportMetricProps) {
  const colors = useColors();
  const metricStyles = useMemo(() => createMetricStyles(colors), [colors]);

  return (
    <Animated.View
      entering={FadeInDown.duration(200).delay(150 + index * 60)}
      style={metricStyles.wrapper}
    >
      <LinearGradient
        colors={[tint + '15', gradientEnd + '06']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={metricStyles.card}
      >
        <View style={metricStyles.topRow}>
          <View style={[metricStyles.iconBg, { backgroundColor: tint + '20' }]}>
            <MaterialCommunityIcons name={icon} size={20} color={tint} />
          </View>
          {trend !== undefined && (
            <View style={[metricStyles.trendPill, { backgroundColor: (trend.direction === 'up' ? colors.accent.success : colors.accent.error) + '18' }]}>
              <MaterialCommunityIcons
                name={trend.direction === 'up' ? 'trending-up' : 'trending-down'}
                size={12}
                color={trend.direction === 'up' ? colors.accent.success : colors.accent.error}
              />
              <Text style={[metricStyles.trendText, { color: trend.direction === 'up' ? colors.accent.success : colors.accent.error }]}>
                {trend.percent}%
              </Text>
            </View>
          )}
        </View>
        <Text style={[metricStyles.value, { color: tint }]}>{value}</Text>
        <Text style={metricStyles.label} numberOfLines={2}>{label}</Text>
      </LinearGradient>
    </Animated.View>
  );
}

const createMetricStyles = (colors: ThemeColors) => StyleSheet.create({
  wrapper: {
    width: '47%',
    flexGrow: 1,
  },
  card: {
    padding: spacing[4],
    gap: spacing[2],
    minHeight: 120,
    borderRadius: borderRadius.xl,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.separator.transparent,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconBg: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trendPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: spacing[2],
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  trendText: {
    ...typography.caption2,
    fontWeight: '700',
  },
  value: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  label: {
    ...typography.caption1,
    color: colors.text.secondary,
  },
});

// ─── Reports content ─────────────────────────────────────────────────────────

function ReportsContent() {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const conversations = useInboxStore((s) => s.conversations);
  const loadConversations = useInboxStore((s) => s.loadConversations);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadConversations();
    setRefreshing(false);
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
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={colors.accent.primary}
          colors={[colors.accent.primary]}
        />
      }
    >
      <Animated.View entering={FadeInDown.duration(200).delay(80)}>
        <View style={styles.periodPill}>
          <MaterialCommunityIcons name="calendar-range" size={14} color={colors.text.secondary} />
          <Text style={styles.periodLabel}>Periodo actual · Todos los datos</Text>
        </View>
      </Animated.View>

      <View style={styles.grid}>
        <ReportMetric
          icon="message-text-outline"
          label="Total conversaciones"
          value={stats.total}
          tint={colors.accent.primary}
          gradientEnd={colors.accent.info}
          trend={{ direction: 'up', percent: 12 }}
          index={0}
        />
        <ReportMetric
          icon="check-circle-outline"
          label="Resueltas"
          value={stats.resolved}
          tint={colors.accent.success}
          gradientEnd={colors.accent.info}
          trend={{ direction: 'up', percent: 18 }}
          index={1}
        />
        <ReportMetric
          icon="message-outline"
          label="Abiertas"
          value={stats.open}
          tint={colors.accent.info}
          gradientEnd={colors.accent.primary}
          trend={{ direction: 'down', percent: 5 }}
          index={2}
        />
        <ReportMetric
          icon="clock-outline"
          label="Pendientes"
          value={stats.pending}
          tint={colors.accent.warning}
          gradientEnd={colors.accent.error}
          index={3}
        />
        <ReportMetric
          icon="alert-circle-outline"
          label="Alta prioridad"
          value={stats.highPriority}
          tint={colors.accent.error}
          gradientEnd={colors.accent.warning}
          trend={{ direction: 'down', percent: 3 }}
          index={4}
        />
        <ReportMetric
          icon="robot-outline"
          label="Analizadas por IA"
          value={stats.withAI}
          tint={colors.accent.purple}
          gradientEnd={colors.accent.primary}
          trend={{ direction: 'up', percent: 24 }}
          index={5}
        />
      </View>

      <Animated.View entering={FadeInDown.duration(400).delay(550)}>
        <GlassCard style={styles.placeholderCard}>
          <View style={styles.placeholderIconCircle}>
            <MaterialCommunityIcons name="chart-line" size={28} color={colors.accent.info} />
          </View>
          <Text style={styles.placeholderTitle}>Graficas avanzadas</Text>
          <Text style={styles.placeholderDesc}>
            Tendencias, tiempos de respuesta y satisfaccion del cliente proximamente.
          </Text>
        </GlassCard>
      </Animated.View>
    </ScrollView>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function ReportsScreen() {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Animated.View entering={FadeInDown.duration(200).delay(50)} style={styles.header}>
        <Text style={styles.title}>Reportes</Text>
      </Animated.View>

      <RoleGate
        minRole="manager"
        fallback={
          <View style={styles.accessDenied}>
            <View style={styles.lockCircle}>
              <MaterialCommunityIcons name="lock-outline" size={32} color={colors.text.tertiary} />
            </View>
            <Text style={styles.accessDeniedTitle}>Acceso restringido</Text>
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
  scrollContent: {
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[24],
    gap: spacing[4],
  },
  periodPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    alignSelf: 'flex-start',
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
  },
  periodLabel: {
    ...typography.caption1,
    color: colors.text.secondary,
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
  placeholderIconCircle: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.full,
    backgroundColor: colors.accent.infoMuted,
    alignItems: 'center',
    justifyContent: 'center',
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
