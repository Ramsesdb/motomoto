import React, { useEffect, useMemo } from 'react';
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
import { useInboxStore } from '@/store/useInboxStore';
import { GlassCard } from '@/components/ui/GlassCard';
import { Avatar } from '@/components/ui/Avatar';
import { Pressable } from '@/components/ui/Pressable';
import { useColors } from '@/hooks/useColors';
import { spacing, typography, borderRadius } from '@/design';
import type { ThemeColors } from '@/design';

// ─── Metric card ──────────────────────────────────────────────────────────────

interface MetricCardProps {
  label: string;
  value: number;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  tint: string;
  gradientEnd: string;
  onPress?: () => void;
  index: number;
  styles: ReturnType<typeof createStyles>;
}

function MetricCard({ label, value, icon, tint, gradientEnd, onPress, index, styles }: MetricCardProps) {
  return (
    <Animated.View
      entering={FadeInDown.duration(400).delay(200 + index * 80)}
      style={styles.metricPressable}
    >
      <Pressable onPress={onPress} style={styles.metricPressableInner}>
        <LinearGradient
          colors={[tint + '15', gradientEnd + '08']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.metricGradient}
        >
          <View style={styles.metricCardContent}>
            <View style={[styles.metricIcon, { backgroundColor: tint + '25' }]}>
              <MaterialCommunityIcons name={icon} size={20} color={tint} />
            </View>
            <Text style={[styles.metricValue, { color: tint }]}>{value}</Text>
            <Text style={styles.metricLabel} numberOfLines={2}>{label}</Text>
          </View>
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const router = useRouter();
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

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
        <Animated.View entering={FadeInDown.duration(400).delay(50)} style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.greeting}>{greeting},</Text>
            <Text style={styles.userName}>{firstName}</Text>
          </View>
          <Pressable onPress={() => router.push('/profile' as never)}>
            <Avatar
              name={user?.name ?? '?'}
              uri={user?.avatarUrl}
              size={48}
              status={user?.status}
            />
          </Pressable>
        </Animated.View>

        {/* ── Metrics grid ───────────────────────────────────────────────────── */}
        <Animated.View entering={FadeInDown.duration(400).delay(120)}>
          <Text style={styles.sectionTitle}>Resumen del día</Text>
        </Animated.View>

        <View style={styles.metricsGrid}>
          <MetricCard
            label="Total conversaciones"
            value={metrics.total}
            icon="message-text-outline"
            tint={colors.accent.primary}
            gradientEnd={colors.accent.info}
            onPress={goToInbox}
            index={0}
            styles={styles}
          />
          <MetricCard
            label="Mensajes sin leer"
            value={metrics.unread}
            icon="bell-badge-outline"
            tint={colors.accent.warning}
            gradientEnd={colors.accent.error}
            onPress={goToInbox}
            index={1}
            styles={styles}
          />
          <MetricCard
            label="Conversaciones abiertas"
            value={metrics.open}
            icon="message-outline"
            tint={colors.accent.success}
            gradientEnd={colors.accent.info}
            onPress={goToInbox}
            index={2}
            styles={styles}
          />
          <MetricCard
            label="Pendientes de respuesta"
            value={metrics.pending}
            icon="clock-outline"
            tint={colors.accent.error}
            gradientEnd={colors.accent.warning}
            onPress={goToInbox}
            index={3}
            styles={styles}
          />
        </View>

        {/* ── Quick actions ──────────────────────────────────────────────────── */}
        <Animated.View entering={FadeInDown.duration(400).delay(550)}>
          <Text style={styles.sectionTitle}>Acceso rápido</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(400).delay(620)} style={styles.quickRow}>
          <Pressable onPress={goToInbox} style={styles.quickActionBtn}>
            <LinearGradient
              colors={[colors.accent.primary + '20', colors.accent.primary + '08']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.quickGradient}
            >
              <View style={styles.quickIconCircle}>
                <MaterialCommunityIcons name="message-text" size={20} color={colors.accent.primary} />
              </View>
              <Text style={styles.quickLabel}>Mensajes</Text>
              <MaterialCommunityIcons name="arrow-right" size={16} color={colors.text.tertiary} />
            </LinearGradient>
          </Pressable>

          <Pressable onPress={() => router.push('/ai' as never)} style={styles.quickActionBtn}>
            <LinearGradient
              colors={[colors.accent.purple + '20', colors.accent.purple + '08']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.quickGradient}
            >
              <View style={[styles.quickIconCircle, { backgroundColor: colors.accent.purpleMuted }]}>
                <MaterialCommunityIcons name="robot" size={20} color={colors.accent.purple} />
              </View>
              <Text style={styles.quickLabel}>Centro IA</Text>
              <MaterialCommunityIcons name="arrow-right" size={16} color={colors.text.tertiary} />
            </LinearGradient>
          </Pressable>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Buenos días';
  if (hour < 19) return 'Buenas tardes';
  return 'Buenas noches';
}

// ─── Styles ───────────────────────────────────────────────────────────────────

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

  /* Header */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: spacing[4],
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
    ...typography.largeTitle,
    fontWeight: '700',
    color: colors.text.primary,
  },

  /* Section */
  sectionTitle: {
    ...typography.headline,
    color: colors.text.primary,
  },

  /* Metrics */
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[3],
  },
  metricPressable: {
    width: '47%',
    flexGrow: 1,
  },
  metricPressableInner: {
    flex: 1,
  },
  metricGradient: {
    borderRadius: borderRadius.xl,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.separator.transparent,
    overflow: 'hidden',
  },
  metricCardContent: {
    padding: spacing[4],
    gap: spacing[2],
    minHeight: 120,
  },
  metricIcon: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricValue: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginTop: spacing[1],
  },
  metricLabel: {
    ...typography.caption1,
    color: colors.text.secondary,
  },

  /* Quick actions */
  quickRow: {
    flexDirection: 'row',
    gap: spacing[3],
  },
  quickActionBtn: {
    flex: 1,
  },
  quickGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    padding: spacing[4],
    borderRadius: borderRadius.xl,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.separator.transparent,
  },
  quickIconCircle: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.full,
    backgroundColor: colors.accent.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickLabel: {
    ...typography.subhead,
    fontWeight: '600',
    color: colors.text.primary,
    flex: 1,
  },
});
