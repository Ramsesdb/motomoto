import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
  type ListRenderItemInfo,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useShallow } from 'zustand/react/shallow';

import { useInboxStore } from '@/store/useInboxStore';
import { MessageBubble } from '@/components/messaging/MessageBubble';
import { ChatInput } from '@/components/messaging/ChatInput';
import { AISuggestionPill } from '@/components/ai/AISuggestionPill';
import { Avatar } from '@/components/ui/Avatar';
import { ChannelBadge } from '@/components/messaging/ChannelBadge';
import { Pressable } from '@/components/ui/Pressable';
import { useColors } from '@/hooks/useColors';
import { spacing, typography, borderRadius } from '@/design';
import type { ThemeColors } from '@/design';
import type { Message } from '@/types';

export default function ChatScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { id } = useLocalSearchParams<{ id: string }>();

  const { conversations, messages, loadMessages, sendMessage } = useInboxStore(
    useShallow((s) => ({
      conversations: s.conversations,
      messages: s.messages,
      loadMessages: s.loadMessages,
      sendMessage: s.sendMessage,
    }))
  );

  const conversation = useMemo(
    () => conversations.find((c) => c.id === id),
    [conversations, id]
  );

  const threadMessages: Message[] = useMemo(
    () => (id !== undefined ? (messages[id] ?? []) : []),
    [messages, id]
  );

  const [inputText, setInputText] = useState('');
  const [pillVisible, setPillVisible] = useState(true);
  const listRef = useRef<FlatList<Message>>(null);

  useEffect(() => {
    if (id !== undefined) {
      loadMessages(id);
    }
  }, [id, loadMessages]);

  useEffect(() => {
    if (threadMessages.length > 0) {
      setTimeout(() => {
        listRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [threadMessages.length]);

  useEffect(() => {
    setPillVisible(true);
  }, [threadMessages.length]);

  const suggestion = useMemo<string | undefined>(() => {
    for (let i = threadMessages.length - 1; i >= 0; i--) {
      const m = threadMessages[i];
      if (m !== undefined && m.role === 'inbound' && m.suggestedReply !== undefined) {
        return m.suggestedReply;
      }
    }
    return undefined;
  }, [threadMessages]);

  const handleSend = useCallback(
    async (text: string) => {
      if (id === undefined) return;
      setInputText('');
      await sendMessage(id, text);
    },
    [id, sendMessage]
  );

  function handleSuggestionPress(text: string) {
    setInputText(text);
    setPillVisible(false);
  }

  function handleNavigateToClient() {
    router.push(`/inbox/${id ?? ''}/client` as never);
  }

  const renderItem = useCallback(
    ({ item, index }: ListRenderItemInfo<Message>) => {
      const showDateSep = shouldShowDateSeparator(threadMessages, index);
      return (
        <>
          {showDateSep && (
            <View style={styles.dateSeparator}>
              <View style={styles.dateLine} />
              <Text style={styles.dateText}>{formatMessageDate(item.sentAt)}</Text>
              <View style={styles.dateLine} />
            </View>
          )}
          <MessageBubble message={item} />
        </>
      );
    },
    [threadMessages, styles]
  );

  const keyExtractor = useCallback((item: Message) => item.id, []);

  const channelType = conversation?.channelType;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* ── Header ───────────────────────────────────────────────────────────── */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <MaterialCommunityIcons
            name="arrow-left"
            size={24}
            color={colors.text.primary}
          />
        </Pressable>

        <Pressable
          onPress={handleNavigateToClient}
          style={styles.contactInfo}
        >
          <View style={styles.avatarContainer}>
            <Avatar
              name={conversation?.contact.name ?? '?'}
              uri={conversation?.contact.avatarUrl}
              size={38}
            />
            {channelType !== undefined && (
              <View style={styles.channelBadgeOverlay}>
                <ChannelBadge channel={channelType} size={18} />
              </View>
            )}
          </View>
          <View style={styles.contactText}>
            <Text style={styles.contactName} numberOfLines={1}>
              {conversation?.contact.name ?? ''}
            </Text>
            {channelType !== undefined && (
              <Text style={styles.channelLabel} numberOfLines={1}>
                {channelType.charAt(0).toUpperCase() + channelType.slice(1)}
              </Text>
            )}
          </View>
        </Pressable>

        <Pressable
          onPress={handleNavigateToClient}
          style={styles.infoButton}
        >
          <MaterialCommunityIcons
            name="information-outline"
            size={22}
            color={colors.text.secondary}
          />
        </Pressable>
      </View>

      {/* ── Messages + Input ─────────────────────────────────────────────────── */}
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        {/* Messages */}
        <FlatList
          ref={listRef}
          data={threadMessages}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          contentContainerStyle={styles.messageList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<EmptyChat />}
        />

        {/* AI Suggestion Pill */}
        {suggestion !== undefined && pillVisible && (
          <View style={styles.pillWrapper}>
            <AISuggestionPill
              suggestion={suggestion}
              onPress={handleSuggestionPress}
              onDismiss={() => setPillVisible(false)}
            />
          </View>
        )}

        {/* Chat Input */}
        <View style={{ paddingBottom: insets.bottom + spacing[14] }}>
          <ChatInput
            value={inputText}
            onChangeText={setInputText}
            onSend={handleSend}
            onAISuggestion={suggestion !== undefined ? () => setPillVisible((v) => !v) : undefined}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ─── Date separator helpers ───────────────────────────────────────────────────

function isSameDay(a: string, b: string): boolean {
  const da = new Date(a);
  const db = new Date(b);
  return (
    da.getFullYear() === db.getFullYear() &&
    da.getMonth() === db.getMonth() &&
    da.getDate() === db.getDate()
  );
}

function shouldShowDateSeparator(messages: Message[], index: number): boolean {
  if (index === 0) return true;
  const prev = messages[index - 1];
  const curr = messages[index];
  if (prev === undefined || curr === undefined) return false;
  return !isSameDay(prev.sentAt, curr.sentAt);
}

function formatMessageDate(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const msgDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diffMs = today.getTime() - msgDay.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Hoy';
  if (diffDays === 1) return 'Ayer';
  return date.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' });
}

function EmptyChat() {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.emptyChat}>
      <View style={styles.emptyChatIcon}>
        <MaterialCommunityIcons name="message-text-outline" size={32} color={colors.text.tertiary} />
      </View>
      <Text style={styles.emptyChatText}>Inicia la conversación</Text>
    </View>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  flex: {
    flex: 1,
  },

  /* Header */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[2],
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.separator.transparent,
    backgroundColor: colors.background.secondary,
    gap: spacing[1],
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  avatarContainer: {
    position: 'relative',
  },
  channelBadgeOverlay: {
    position: 'absolute',
    bottom: -2,
    right: -4,
  },
  contactText: {
    flex: 1,
    gap: 1,
  },
  contactName: {
    ...typography.headline,
    color: colors.text.primary,
  },
  channelLabel: {
    ...typography.caption1,
    color: colors.text.tertiary,
  },
  infoButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Messages */
  messageList: {
    paddingVertical: spacing[3],
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  dateSeparator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[3],
  },
  dateLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.separator.transparent,
  },
  dateText: {
    ...typography.caption1,
    color: colors.text.tertiary,
    fontWeight: '600',
  },

  /* AI Pill */
  pillWrapper: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    backgroundColor: colors.background.primary,
  },

  /* Empty */
  emptyChat: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing[16],
    gap: spacing[3],
  },
  emptyChatIcon: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyChatText: {
    ...typography.subhead,
    color: colors.text.tertiary,
  },
});
