import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type ListRenderItemInfo,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useShallow } from 'zustand/react/shallow';

import { useInboxStore } from '@/store/useInboxStore';
import { MessageBubble } from '@/components/messaging/MessageBubble';
import { ChatInput } from '@/components/messaging/ChatInput';
import { AISuggestionPill } from '@/components/ai/AISuggestionPill';
import { Avatar } from '@/components/ui/Avatar';
import { colors, spacing, typography } from '@/design';
import type { Message } from '@/types';

export default function ChatScreen() {
  const router = useRouter();
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

  // Load messages on mount
  useEffect(() => {
    if (id !== undefined) {
      loadMessages(id);
    }
  }, [id, loadMessages]);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (threadMessages.length > 0) {
      listRef.current?.scrollToEnd({ animated: true });
    }
  }, [threadMessages.length]);

  // Reset pill visibility when new messages arrive
  useEffect(() => {
    setPillVisible(true);
  }, [threadMessages.length]);

  // Find the latest inbound message with a suggestedReply
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
    ({ item }: ListRenderItemInfo<Message>) => <MessageBubble message={item} />,
    []
  );

  const keyExtractor = useCallback((item: Message) => item.id, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* ── Header ───────────────────────────────────────────────────────────── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton} activeOpacity={0.7}>
          <MaterialCommunityIcons
            name="chevron-left"
            size={28}
            color={colors.text.primary}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleNavigateToClient}
          style={styles.contactInfo}
          activeOpacity={0.7}
        >
          <Avatar
            name={conversation?.contact.name ?? '?'}
            uri={conversation?.contact.avatarUrl}
            size={36}
          />
          <View style={styles.contactText}>
            <Text style={styles.contactName} numberOfLines={1}>
              {conversation?.contact.name ?? ''}
            </Text>
            <Text style={styles.channelLabel} numberOfLines={1}>
              {conversation?.channelType ?? ''}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleNavigateToClient}
          style={styles.infoButton}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name="information-outline"
            size={24}
            color={colors.text.secondary}
          />
        </TouchableOpacity>
      </View>

      {/* ── KeyboardAvoidingView wraps messages + input ───────────────────────── */}
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
        <ChatInput
          value={inputText}
          onChangeText={setInputText}
          onSend={handleSend}
          onAISuggestion={suggestion !== undefined ? () => setPillVisible((v) => !v) : undefined}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function EmptyChat() {
  return (
    <View style={styles.emptyChat}>
      <Text style={styles.emptyChatText}>Inicia la conversación</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[2],
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.separator.transparent,
    gap: spacing[2],
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
    gap: spacing[2],
  },
  contactText: {
    flex: 1,
    gap: 2,
  },
  contactName: {
    ...typography.headline,
    color: colors.text.primary,
  },
  channelLabel: {
    ...typography.caption1,
    color: colors.text.tertiary,
    textTransform: 'capitalize',
  },
  infoButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageList: {
    paddingVertical: spacing[3],
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  pillWrapper: {
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[2],
  },
  emptyChat: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing[16],
  },
  emptyChatText: {
    ...typography.body,
    color: colors.text.tertiary,
  },
});
