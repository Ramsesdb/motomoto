import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
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
import { FilterTab } from '@/components/ui/FilterTab';
import { SkeletonConversationList } from '@/components/ui/Skeleton';
import { useColors } from '@/hooks/useColors';
import { spacing, typography, borderRadius, fontFamily } from '@/design';
import type { ThemeColors } from '@/design';
import type { Conversation, ConversationStatus } from '@/types';

// ─── Filter data ──────────────────────────────────────────────────────────────

interface StatusFilter {
  label: string;
  value: ConversationStatus | 'all';
}

const STATUS_FILTERS: StatusFilter[] = [
  { label: 'Todos', value: 'all' },
  { label: 'Abiertos', value: 'open' },
  { label: 'Pendientes', value: 'pending' },
  { label: 'Resueltos', value: 'resolved' },
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

  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    loadConversations().finally(() => setIsLoading(false));
  }, [loadConversations]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadConversations();
    setRefreshing(false);
  }, [loadConversations]);

  const activeStatus = filters.status ?? 'all';

  const filtered = useMemo<Conversation[]>(() => {
    const q = searchQuery.trim().toLowerCase();
    return conversations.filter((c) => {
      if (filters.status !== undefined && c.status !== filters.status) return false;
      if (q.length > 0) {
        const nameMatch = c.contact.name.toLowerCase().includes(q);
        const msgMatch = c.lastMessage?.content.toLowerCase().includes(q) ?? false;
        if (!nameMatch && !msgMatch) return false;
      }
      return true;
    });
  }, [conversations, filters, searchQuery]);

  function handleConversationPress(conversationId: string) {
    router.push(`/inbox/${conversationId}` as never);
  }

  function handleFilterPress(value: ConversationStatus | 'all') {
    setFilters({ status: value === 'all' ? undefined : value });
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* ── Header ───────────────────────────────────────────────────────────── */}
      <Animated.View entering={FadeInDown.duration(200).delay(50)} style={styles.header}>
        <Text style={styles.title}>Mensajes</Text>
        <View style={styles.headerSpacer} />
        <Pressable onPress={() => setShowSearch((v) => !v)} style={styles.searchToggle}>
          <MaterialCommunityIcons
            name={showSearch ? 'close' : 'magnify'}
            size={22}
            color={colors.onSurfaceVariant}
          />
        </Pressable>
      </Animated.View>

      {/* ── Search bar ────────────────────────────────────────────────────── */}
      {showSearch && (
        <Animated.View entering={FadeInDown.duration(250)} style={styles.searchBar}>
          <MaterialCommunityIcons name="magnify" size={18} color={colors.onSurfaceVariant} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por nombre o mensaje..."
            placeholderTextColor={colors.text.placeholder}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
            returnKeyType="search"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')}>
              <MaterialCommunityIcons name="close-circle" size={16} color={colors.onSurfaceVariant} />
            </Pressable>
          )}
        </Animated.View>
      )}

      {/* ── Filter tabs ──────────────────────────────────────────────────── */}
      <Animated.View entering={FadeInDown.duration(200).delay(120)}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {STATUS_FILTERS.map((filter) => (
            <FilterTab
              key={filter.value}
              label={filter.label}
              active={filter.value === activeStatus}
              onPress={() => handleFilterPress(filter.value)}
            />
          ))}
        </ScrollView>
      </Animated.View>

      {/* ── List ─────────────────────────────────────────────────────────────── */}
      {isLoading ? (
        <SkeletonConversationList />
      ) : (
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
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.accent.primary}
              colors={[colors.accent.primary]}
            />
          }
        />
      )}
    </SafeAreaView>
  );
}

function EmptyState() {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { clearFilters } = useInboxStore(useShallow((s) => ({ clearFilters: s.clearFilters })));

  return (
    <View style={styles.empty}>
      <View style={styles.emptyIconWrapper}>
        <MaterialCommunityIcons name="message-text-clock-outline" size={40} color={colors.onSurfaceVariant} />
      </View>
      <Text style={styles.emptyTitle}>Sin conversaciones</Text>
      <Text style={styles.emptySubtitle}>No hay conversaciones con estos filtros.</Text>
      <Pressable onPress={clearFilters} style={styles.emptyCta}>
        <MaterialCommunityIcons name="filter-remove-outline" size={16} color={colors.primary} />
        <Text style={styles.emptyCtaText}>Limpiar filtros</Text>
      </Pressable>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surfaceBackground,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingTop: spacing[4],
    paddingBottom: spacing[2],
  },
  title: {
    ...typography.headlineLarge,
    fontFamily: fontFamily.displayBold,
    color: colors.onSurface,
  },
  headerSpacer: {
    flex: 1,
  },
  searchToggle: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    marginHorizontal: spacing[4],
    marginBottom: spacing[2],
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    backgroundColor: colors.surfaceContainerHigh,
    borderRadius: borderRadius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.outlineVariant,
  },
  searchInput: {
    flex: 1,
    ...typography.bodyMedium,
    fontFamily: fontFamily.bodyRegular,
    color: colors.onSurface,
    paddingVertical: spacing[1],
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing[4],
    paddingTop: spacing[1],
    paddingBottom: spacing[3],
    gap: spacing[2],
    alignItems: 'center',
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
    backgroundColor: colors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[1],
  },
  emptyTitle: {
    ...typography.titleMedium,
    fontFamily: fontFamily.displaySemiBold,
    color: colors.onSurface,
  },
  emptySubtitle: {
    ...typography.bodyMedium,
    fontFamily: fontFamily.bodyRegular,
    color: colors.onSurfaceVariant,
  },
  emptyCta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    marginTop: spacing[2],
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderRadius: borderRadius.full,
    backgroundColor: colors.primaryContainer,
  },
  emptyCtaText: {
    ...typography.labelLarge,
    fontFamily: fontFamily.bodySemiBold,
    color: colors.primary,
  },
});
