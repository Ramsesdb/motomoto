import React, { useCallback, useMemo, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
  type ListRenderItemInfo,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { RoleGate } from '@/components/ui/RoleGate';
import { AIInsightCard } from '@/components/ai/AIInsightCard';
import { TeamMemberCard } from '@/components/ui/TeamMemberCard';
import { useColors } from '@/hooks/useColors';
import { spacing, borderRadius, type ThemeColors } from '@m2/design';
import { fontFamily, typography } from '@m2/design';
import { MOCK_AGENT, MOCK_MANAGER, MOCK_ADMIN } from '@/mock';
import type { User } from '@m2/types';

interface MemberEntry {
  user: User;
  stats: { label: string; value: string };
  activityLabel: string;
}

const TEAM_MEMBERS: MemberEntry[] = [
  { user: MOCK_AGENT, stats: { label: 'Leads', value: '14 leads' }, activityLabel: '4h activo' },
  { user: MOCK_MANAGER, stats: { label: 'Reporte', value: 'Reporte listo' }, activityLabel: '8 equipos' },
  { user: MOCK_ADMIN, stats: { label: 'Permisos', value: 'Permisos altos' }, activityLabel: 'Ausente 15m' },
];

// ─── Screen ───────────────────────────────────────────────────────────────────

function TeamList() {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await new Promise<void>((r) => setTimeout(r, 800));
    setRefreshing(false);
  }, []);

  function renderItem({ item, index }: ListRenderItemInfo<MemberEntry>) {
    return (
      <Animated.View
        entering={FadeInDown.duration(200).delay(300 + index * 60)}
        style={styles.cardWrapper}
      >
        <TeamMemberCard
          user={item.user}
          stats={item.stats}
          activityLabel={item.activityLabel}
        />
      </Animated.View>
    );
  }

  return (
    <FlatList
      data={TEAM_MEMBERS}
      keyExtractor={(item) => item.user.id}
      renderItem={renderItem}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={colors.primary}
          colors={[colors.primary]}
        />
      }
      ListHeaderComponent={
        <View style={styles.headerContent}>
          {/* Weekly performance header */}
          <Animated.View entering={FadeInDown.duration(200).delay(50)}>
            <Text style={styles.headline}>Rendimiento Semanal</Text>
            <Text style={styles.subhead}>+12% efectividad esta semana</Text>
          </Animated.View>

          {/* AI Insight Card */}
          <Animated.View entering={FadeInDown.duration(200).delay(150)}>
            <AIInsightCard
              title="Seguimiento"
              body="3 agentes necesitan seguimiento hoy"
            />
          </Animated.View>

          {/* Section label */}
          <Text style={styles.sectionLabel}>EQUIPO</Text>
        </View>
      }
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
    />
  );
}

export default function TeamScreen() {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <RoleGate
        minRole="manager"
        fallback={
          <View style={styles.accessDenied}>
            <View style={styles.lockCircle}>
              <MaterialCommunityIcons
                name="lock-outline"
                size={32}
                color={colors.onSurfaceVariant}
              />
            </View>
            <Text style={styles.accessDeniedTitle}>Acceso restringido</Text>
            <Text style={styles.accessDeniedText}>
              Solo gerentes y administradores pueden ver el equipo.
            </Text>
          </View>
        }
      >
        <TeamList />
      </RoleGate>
    </SafeAreaView>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surfaceBackground,
  },
  headerContent: {
    paddingHorizontal: spacing[4],
    paddingTop: spacing[4],
    paddingBottom: spacing[2],
    gap: spacing[4],
  },
  headline: {
    fontFamily: fontFamily.displayBold,
    ...typography.headline,
    fontWeight: '700',
    color: colors.onSurface,
  },
  subhead: {
    fontFamily: fontFamily.bodyRegular,
    ...typography.subhead,
    color: colors.tertiary,
    marginTop: spacing[1],
  },
  sectionLabel: {
    fontFamily: fontFamily.bodyRegular,
    ...typography.caption1,
    color: colors.onSurfaceVariant,
    fontWeight: '600',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  cardWrapper: {
    paddingHorizontal: spacing[4],
    marginBottom: spacing[3],
  },
  listContent: {
    paddingBottom: spacing[24],
  },

  /* Access denied */
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
    backgroundColor: colors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[2],
  },
  accessDeniedTitle: {
    fontFamily: fontFamily.displaySemiBold,
    ...typography.headline,
    color: colors.onSurface,
  },
  accessDeniedText: {
    fontFamily: fontFamily.bodyRegular,
    ...typography.subhead,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
  },
});
