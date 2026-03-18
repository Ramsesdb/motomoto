import React, { useEffect, useMemo } from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useShallow } from 'zustand/react/shallow';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { useInboxStore } from '@/store/useInboxStore';
import { Pressable } from '@/components/ui/Pressable';
import { ConversationCard } from '@/components/messaging/ConversationCard';
import { useColors } from '@/hooks/useColors';
import { spacing, typography, borderRadius } from '@/design';
import type { ThemeColors } from '@/design';
import type { ChannelType, Conversation, ConversationStatus } from '@/types';

// ─── Filter chip data ─────────────────────────────────────────────────────────

interface StatusChip {
  label: string;
  value: ConversationStatus | 'all';
}

const STATUS_CHIPS: StatusChip[] = [
  { label: 'Todos', value: 'all' },
  { label: 'Abiertos', value: 'open' },
  { label: 'Pendientes', value: 'pending' },
  { label: 'Resueltos', value: 'resolved' },
];

interface ChannelChip {
  label: string;
  value: ChannelType | 'all';
  icon?: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  tintKey?: keyof ThemeColors['channel'];
}

const CHANNEL_CHIPS: ChannelChip[] = [
  { label: 'Todos', value: 'all' },
  { label: 'WhatsApp', value: 'whatsapp', icon: 'whatsapp', tintKey: 'whatsapp' },
  { label: 'Instagram', value: 'instagram', icon: 'instagram', tintKey: 'instagram' },
  { label: 'Facebook', value: 'facebook', icon: 'facebook', tintKey: 'facebook' },
  { label: 'SMS', value: 'sms', icon: 'message-text-outline', tintKey: 'sms' },
  { label: 'Email', value: 'email', icon: 'email-outline', tintKey: 'email' },
];

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function InboxScreen() {
  const router = useRouter();
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const { conversations, filters, loadConversations, setFilters } = useInboxStore(
    useShallow((s) => ({
      conversations: s.conversations,
      filters: s.filters,
      loadConversations: s.loadConversations,
      setFilters: s.setFilters,
    }))
  );

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  const filtered = useMemo<Conversation[]>(() => {
    return conversations.filter((c) => {
      if (filters.status !== undefined && c.status !== filters.status) return false;
      if (filters.channelType !== undefined && c.channelType !== filters.channelType) return false;
      return true;
    });
  }, [conversations, filters]);

  function handleConversationPress(conversationId: string) {
    router.push(`/inbox/${conversationId}` as never);
  }

  const activeStatus = filters.status ?? 'all';
  const activeChannel = filters.channelType ?? 'all';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* ── Header ───────────────────────────────────────────────────────────── */}
      <Animated.View entering={FadeInDown.duration(350).delay(50)} style={styles.header}>
        <Text style={styles.title}>Mensajes</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{conversations.length}</Text>
        </View>
      </Animated.View>

      {/* ── Filters ────────────────────────────────────────────────────────── */}
      <Animated.View entering={FadeInDown.duration(350).delay(120)}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {STATUS_CHIPS.map((chip) => {
            const active = chip.value === activeStatus;
            return (
              <Pressable
                key={chip.value}
                onPress={() =>
                  setFilters({
                    status: chip.value === 'all' ? undefined : chip.value,
                  })
                }
                style={[styles.chip, active && styles.chipActive]}
              >
                <Text style={[styles.chipLabel, active && styles.chipLabelActive]}>
                  {chip.label}
                </Text>
              </Pressable>
            );
          })}

          <View style={styles.chipDivider} />

          {CHANNEL_CHIPS.map((chip) => {
            const active = chip.value === activeChannel;
            const tint = chip.tintKey !== undefined ? colors.channel[chip.tintKey] : undefined;
            return (
              <Pressable
                key={chip.value}
                onPress={() =>
                  setFilters({
                    channelType: chip.value === 'all' ? undefined : chip.value,
                  })
                }
                style={[
                  styles.chip,
                  active && styles.chipActive,
                  active && tint !== undefined && { borderColor: tint, backgroundColor: tint + '18' },
                ]}
              >
                {chip.icon !== undefined && (
                  <MaterialCommunityIcons
                    name={chip.icon}
                    size={14}
                    color={active && tint !== undefined ? tint : colors.text.secondary}
                  />
                )}
                <Text style={[
                  styles.chipLabel,
                  active && styles.chipLabelActive,
                  active && tint !== undefined && { color: tint },
                ]}>
                  {chip.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </Animated.View>

      {/* ── List ─────────────────────────────────────────────────────────────── */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ConversationCard
            conversation={item}
            onPress={handleConversationPress}
          />
        )}
        ListEmptyComponent={<EmptyState />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

function EmptyState() {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.empty}>
      <View style={styles.emptyIconWrapper}>
        <MaterialCommunityIcons name="message-text-outline" size={40} color={colors.text.tertiary} />
      </View>
      <Text style={styles.emptyTitle}>Sin conversaciones</Text>
      <Text style={styles.emptySubtitle}>No hay conversaciones con estos filtros</Text>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    paddingHorizontal: spacing[4],
    paddingTop: spacing[4],
    paddingBottom: spacing[2],
  },
  title: {
    ...typography.largeTitle,
    color: colors.text.primary,
    fontWeight: '700',
  },
  countBadge: {
    backgroundColor: colors.accent.primaryMuted,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing[2],
    paddingVertical: 2,
    minWidth: 28,
    alignItems: 'center',
  },
  countText: {
    ...typography.caption1,
    color: colors.accent.primary,
    fontWeight: '700',
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing[4],
    paddingTop: spacing[1],
    paddingBottom: spacing[3],
    gap: spacing[2],
    alignItems: 'center',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    backgroundColor: colors.background.tertiary,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  chipActive: {
    backgroundColor: colors.accent.primaryMuted,
    borderColor: colors.accent.primary,
  },
  chipLabel: {
    ...typography.caption1,
    fontWeight: '500',
    color: colors.text.secondary,
  },
  chipLabelActive: {
    color: colors.accent.primary,
    fontWeight: '600',
  },
  chipDivider: {
    width: 1,
    height: 20,
    backgroundColor: colors.separator.opaque,
    marginHorizontal: spacing[1],
  },
  listContent: {
    paddingBottom: spacing[24],
  },
  empty: {
    alignItems: 'center',
    paddingTop: spacing[16],
    gap: spacing[3],
  },
  emptyIconWrapper: {
    width: 72,
    height: 72,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[1],
  },
  emptyTitle: {
    ...typography.headline,
    color: colors.text.primary,
  },
  emptySubtitle: {
    ...typography.subhead,
    color: colors.text.tertiary,
  },
});
