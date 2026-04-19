import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable as RNPressable,
  StyleSheet,
  Text,
  View,
  type ListRenderItemInfo,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useShallow } from 'zustand/react/shallow';

import { useInboxStore } from '@/store/useInboxStore';
import { MessageBubble } from '@/components/messaging/MessageBubble';
import { ChatInput } from '@/components/messaging/ChatInput';
import { AISuggestionPill } from '@/components/ai/AISuggestionPill';
import { AIInsightCard } from '@/components/ai/AIInsightCard';
import { GlassHeader } from '@/components/navigation/GlassHeader';
import { useColors } from '@/hooks/useColors';
import { spacing, typography, borderRadius } from '@/design';
import type { ThemeColors } from '@/design';
import type { Message, ConversationStatus } from '@/types';

// ─── Status pill label mapping ────────────────────────────────────────────────

function statusLabel(status: ConversationStatus): string {
  switch (status) {
    case 'open':
      return 'Abierto';
    case 'resolved':
      return 'Cerrado';
    case 'pending':
      return 'Pendiente';
    case 'spam':
      return 'Spam';
  }
}

// ─── Screen ───────────────────────────────────────────────────────────────────

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
  const [insightDismissed, setInsightDismissed] = useState(false);
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

  const aiSummary = conversation?.aiContext?.summary;
  const showInsight = aiSummary !== undefined && !insightDismissed;

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

  // ── Header right accessory: phone + menu icons ──────────────────────────────

  const rightAccessory = useMemo(
    () => (
      <View style={styles.headerRight}>
        <RNPressable
          onPress={() => {
            /* phone action placeholder */
          }}
          style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1, padding: spacing[1] })}
          hitSlop={8}
        >
          <MaterialCommunityIcons name="phone-outline" size={22} color={colors.onSurfaceVariant} />
        </RNPressable>
        <RNPressable
          onPress={handleNavigateToClient}
          style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1, padding: spacing[1] })}
          hitSlop={8}
        >
          <MaterialCommunityIcons name="dots-vertical" size={22} color={colors.onSurfaceVariant} />
        </RNPressable>
      </View>
    ),
    [colors, styles, handleNavigateToClient]
  );

  // ── Render message item ─────────────────────────────────────────────────────

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

  return (
    <View style={styles.container}>
      {/* ── Glass Header ──────────────────────────────────────────────────────── */}
      <GlassHeader
        title={conversation?.contact.name ?? ''}
        statusPill={conversation !== undefined ? statusLabel(conversation.status) : undefined}
        onBack={() => router.back()}
        avatar={{
          name: conversation?.contact.name ?? '?',
          uri: conversation?.contact.avatarUrl,
        }}
        rightAccessory={rightAccessory}
      />

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
          inverted
          contentContainerStyle={styles.messageList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<EmptyChat />}
          ListHeaderComponent={
            showInsight ? (
              <View style={styles.insightWrapper}>
                <AIInsightCard
                  variant="inline"
                  title="Resumen IA"
                  body={aiSummary}
                  onDismiss={() => setInsightDismissed(true)}
                />
              </View>
            ) : null
          }
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
    </View>
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

function shouldShowDateSeparator(msgs: Message[], index: number): boolean {
  if (index === 0) return true;
  const prev = msgs[index - 1];
  const curr = msgs[index];
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
        <MaterialCommunityIcons name="message-reply-text-outline" size={32} color={colors.onSurfaceVariant} />
      </View>
      <Text style={styles.emptyChatTitle}>Sin mensajes aún</Text>
      <Text style={styles.emptyChatText}>Envía el primer mensaje para iniciar la conversación</Text>
    </View>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surfaceBackground,
  },
  flex: {
    flex: 1,
  },

  /* Header right */
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },

  /* Messages */
  messageList: {
    paddingVertical: spacing[3],
    flexGrow: 1,
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
    backgroundColor: colors.outlineVariant,
  },
  dateText: {
    ...typography.labelSmall,
    color: colors.onSurfaceVariant,
    fontWeight: '600',
  },

  /* AI Insight inline */
  insightWrapper: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
  },

  /* AI Pill */
  pillWrapper: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    backgroundColor: colors.surfaceBackground,
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
    backgroundColor: colors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyChatTitle: {
    ...typography.titleMedium,
    color: colors.onSurface,
  },
  emptyChatText: {
    ...typography.bodyMedium,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    paddingHorizontal: spacing[8],
  },
});
