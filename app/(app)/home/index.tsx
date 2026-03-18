import React, { useEffect, useMemo } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useShallow } from 'zustand/react/shallow';

import { useAuthStore } from '@/store/useAuthStore';
import { useInboxStore } from '@/store/useInboxStore';
import { GlassCard } from '@/components/ui/GlassCard';
import { Avatar } from '@/components/ui/Avatar';
import { Pressable } from '@/components/ui/Pressable';
import { colors, spacing, typography, borderRadius } from '@/design';

// ─── Metric card ──────────────────────────────────────────────────────────────

interface MetricCardProps {
  label: string;
  value: number;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  tint: string;
  onPress?: () => void;
}

function MetricCard({ label, value, icon, tint, onPress }: MetricCardProps) {
  return (
    <Pressable onPress={onPress} style={styles.metricPressable}>
      <GlassCard style={styles.metricCard}>
        <View style={[styles.metricIcon, { backgroundColor: tint + '33' }]}>
          <MaterialCommunityIcons name={icon} size={22} color={tint} />
        </View>
        <Text style={styles.metricValue}>{value}</Text>
        <Text style={styles.metricLabel} numberOfLines={2}>{label}</Text>
      </GlassCard>
    </Pressable>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const router = useRouter();

  const user = useAuthStore((s) => s.user);
  const { conversations, loadConversations } = useInboxStore(
    useShallow((s) => ({
      conversations: s.conversations,
      loadConversations: s.loadConversations,
    }))
  );

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  const metrics = useMemo(() => {
    const total = conversations.length;
    const open = conversations.filter((c) => c.status === 'open').length;
    const pending = conversations.filter((c) => c.status === 'pending').length;
    const unread = conversations.reduce((sum, c) => sum + c.unreadCount, 0);
    return { total, open, pending, unread };
  }, [conversations]);

  function goToInbox() {
    router.push('/inbox' as never);
  }

  const greeting = getGreeting();
  const firstName = user?.name.split(' ')[0] ?? 'equipo';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Header ─────────────────────────────────────────────────────────── */}
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.greeting}>{greeting},</Text>
            <Text style={styles.userName}>{firstName}</Text>
          </View>
          <Pressable onPress={() => router.push('/profile' as never)}>
            <Avatar
              name={user?.name ?? '?'}
              uri={user?.avatarUrl}
              size={44}
              status={user?.status}
            />
          </Pressable>
        </View>

        {/* ── Metrics grid ───────────────────────────────────────────────────── */}
        <Text style={styles.sectionTitle}>Resumen del día</Text>
        <View style={styles.metricsGrid}>
          <MetricCard
            label="Total conversaciones"
            value={metrics.total}
            icon="message-text-outline"
            tint={colors.accent.primary}
            onPress={goToInbox}
          />
          <MetricCard
            label="Mensajes sin leer"
            value={metrics.unread}
            icon="bell-badge-outline"
            tint={colors.accent.warning}
            onPress={goToInbox}
          />
          <MetricCard
            label="Conversaciones abiertas"
            value={metrics.open}
            icon="message-outline"
            tint={colors.accent.success}
            onPress={goToInbox}
          />
          <MetricCard
            label="Pendientes de respuesta"
            value={metrics.pending}
            icon="clock-outline"
            tint={colors.accent.error}
            onPress={goToInbox}
          />
        </View>

        {/* ── Quick actions ──────────────────────────────────────────────────── */}
        <Text style={styles.sectionTitle}>Acceso rápido</Text>
        <GlassCard style={styles.quickActions}>
          <QuickAction
            icon="message-text"
            label="Ir a Mensajes"
            onPress={goToInbox}
          />
          <View style={styles.quickDivider} />
          <QuickAction
            icon="robot"
            label="Centro IA"
            onPress={() => router.push('/ai' as never)}
          />
        </GlassCard>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Quick action row ─────────────────────────────────────────────────────────

interface QuickActionProps {
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  label: string;
  onPress: () => void;
}

function QuickAction({ icon, label, onPress }: QuickActionProps) {
  return (
    <Pressable onPress={onPress} style={quickStyles.row}>
      <MaterialCommunityIcons name={icon} size={20} color={colors.accent.primary} />
      <Text style={quickStyles.label}>{label}</Text>
      <MaterialCommunityIcons name="chevron-right" size={20} color={colors.text.tertiary} />
    </Pressable>
  );
}

const quickStyles = StyleSheet.create({
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

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Buenos días';
  if (hour < 19) return 'Buenas tardes';
  return 'Buenas noches';
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: spacing[2],
    paddingBottom: spacing[2],
  },
  headerText: {
    flex: 1,
    gap: 2,
  },
  greeting: {
    ...typography.subhead,
    color: colors.text.secondary,
  },
  userName: {
    ...typography.title1,
    fontWeight: '700',
    color: colors.text.primary,
  },
  sectionTitle: {
    ...typography.headline,
    color: colors.text.primary,
    marginBottom: -spacing[2],
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[3],
  },
  metricPressable: {
    width: '47%',
  },
  metricCard: {
    padding: spacing[4],
    gap: spacing[2],
    minHeight: 100,
  },
  metricIcon: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricValue: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text.primary,
    letterSpacing: -0.5,
  },
  metricLabel: {
    ...typography.caption1,
    color: colors.text.secondary,
  },
  quickActions: {
    overflow: 'hidden',
  },
  quickDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.separator.transparent,
    marginLeft: spacing[4] + 20 + spacing[3],
  },
});
