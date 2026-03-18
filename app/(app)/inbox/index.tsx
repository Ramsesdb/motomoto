import React, { useEffect, useMemo } from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useShallow } from 'zustand/react/shallow';

import { useInboxStore } from '@/store/useInboxStore';
import { ConversationCard } from '@/components/messaging/ConversationCard';
import { colors, spacing, typography, borderRadius } from '@/design';
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
}

const CHANNEL_CHIPS: ChannelChip[] = [
  { label: 'Canal', value: 'all' },
  { label: 'WhatsApp', value: 'whatsapp' },
  { label: 'Instagram', value: 'instagram' },
  { label: 'Facebook', value: 'facebook' },
  { label: 'SMS', value: 'sms' },
  { label: 'Email', value: 'email' },
];

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function InboxScreen() {
  const router = useRouter();
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
      <View style={styles.header}>
        <Text style={styles.title}>Mensajes</Text>
        <Text style={styles.count}>{conversations.length}</Text>
      </View>

      {/* ── Status filter ────────────────────────────────────────────────────── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
      >
        {STATUS_CHIPS.map((chip) => {
          const active = chip.value === activeStatus;
          return (
            <TouchableOpacity
              key={chip.value}
              onPress={() =>
                setFilters({
                  status: chip.value === 'all' ? undefined : chip.value,
                })
              }
              style={[styles.chip, active && styles.chipActive]}
              activeOpacity={0.7}
            >
              <Text style={[styles.chipLabel, active && styles.chipLabelActive]}>
                {chip.label}
              </Text>
            </TouchableOpacity>
          );
        })}

        <View style={styles.chipDivider} />

        {CHANNEL_CHIPS.map((chip) => {
          const active = chip.value === activeChannel;
          return (
            <TouchableOpacity
              key={chip.value}
              onPress={() =>
                setFilters({
                  channelType: chip.value === 'all' ? undefined : chip.value,
                })
              }
              style={[styles.chip, active && styles.chipActive]}
              activeOpacity={0.7}
            >
              <Text style={[styles.chipLabel, active && styles.chipLabelActive]}>
                {chip.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

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
  return (
    <View style={styles.empty}>
      <Text style={styles.emptyText}>Sin conversaciones</Text>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    paddingHorizontal: spacing[4],
    paddingTop: spacing[2],
    paddingBottom: spacing[3],
  },
  title: {
    ...typography.largeTitle,
    color: colors.text.primary,
    fontWeight: '700',
  },
  count: {
    ...typography.footnote,
    color: colors.text.tertiary,
    marginTop: spacing[1],
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[3],
    gap: spacing[2],
    alignItems: 'center',
  },
  chip: {
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    backgroundColor: colors.background.tertiary,
    borderWidth: 1,
    borderColor: colors.separator.transparent,
  },
  chipActive: {
    backgroundColor: colors.accent.primaryMuted,
    borderColor: colors.accent.primary,
  },
  chipLabel: {
    ...typography.footnote,
    color: colors.text.secondary,
  },
  chipLabelActive: {
    color: colors.accent.primary,
    fontWeight: '600',
  },
  chipDivider: {
    width: StyleSheet.hairlineWidth,
    height: 20,
    backgroundColor: colors.separator.opaque,
    marginHorizontal: spacing[1],
  },
  listContent: {
    paddingBottom: spacing[20],
  },
  empty: {
    alignItems: 'center',
    paddingTop: spacing[16],
  },
  emptyText: {
    ...typography.body,
    color: colors.text.tertiary,
  },
});
