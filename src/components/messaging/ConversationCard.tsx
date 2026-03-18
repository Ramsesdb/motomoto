import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useColors } from '@/hooks/useColors';
import { spacing, typography, borderRadius } from '@/design';
import type { ThemeColors } from '@/design';
import { Avatar } from '@/components/ui/Avatar';
import { Pressable } from '@/components/ui/Pressable';
import { ChannelBadge } from './ChannelBadge';
import type { Conversation } from '@/types';

interface ConversationCardProps {
  conversation: Conversation;
  onPress: (conversationId: string) => void;
}

function formatTime(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const isToday =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();
  if (isToday) {
    const hh = String(date.getHours()).padStart(2, '0');
    const mm = String(date.getMinutes()).padStart(2, '0');
    return `${hh}:${mm}`;
  }
  const dd = String(date.getDate()).padStart(2, '0');
  const mo = String(date.getMonth() + 1).padStart(2, '0');
  return `${dd}/${mo}`;
}

function getPriorityColor(priority: string, colors: ThemeColors): string | undefined {
  if (priority === 'urgent') return colors.accent.error;
  if (priority === 'high') return colors.accent.warning;
  return undefined;
}

export function ConversationCard({ conversation, onPress }: ConversationCardProps) {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { contact, lastMessage, unreadCount, channelType, updatedAt, priority } = conversation;
  const hasUnread = unreadCount > 0;
  const priorityColor = getPriorityColor(priority, colors);

  return (
    <Pressable onPress={() => onPress(conversation.id)} style={styles.pressable}>
      <View style={styles.row}>
        {priorityColor !== undefined && (
          <View style={[styles.priorityStripe, { backgroundColor: priorityColor }]} />
        )}
        <View style={styles.avatarWrapper}>
          <Avatar name={contact.name} uri={contact.avatarUrl} size={48} />
          <View style={styles.channelBadgeOverlay}>
            <ChannelBadge channel={channelType} size={20} />
          </View>
        </View>
        <View style={styles.content}>
          <View style={styles.topRow}>
            <Text style={[styles.name, hasUnread && styles.nameUnread]} numberOfLines={1}>
              {contact.name}
            </Text>
            <Text style={styles.time}>{formatTime(updatedAt)}</Text>
          </View>
          <View style={styles.bottomRow}>
            <Text
              style={[styles.preview, hasUnread && styles.previewUnread]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {lastMessage?.content ?? ''}
            </Text>
            {hasUnread && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {unreadCount > 99 ? '99+' : String(unreadCount)}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
      <View style={styles.separator} />
    </Pressable>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    pressable: {
      backgroundColor: colors.background.secondary,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing[4],
      paddingVertical: spacing[3],
      gap: spacing[3],
    },
    priorityStripe: {
      position: 'absolute',
      left: 0,
      top: spacing[2],
      bottom: spacing[2],
      width: 3,
      borderRadius: borderRadius.full,
    },
    avatarWrapper: { position: 'relative' },
    channelBadgeOverlay: { position: 'absolute', bottom: -2, right: -2 },
    content: { flex: 1, gap: spacing[1] },
    topRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: spacing[2],
    },
    name: { flex: 1, ...typography.callout, color: colors.text.primary },
    nameUnread: { fontWeight: '600' },
    time: { ...typography.caption1, color: colors.text.tertiary },
    bottomRow: { flexDirection: 'row', alignItems: 'center', gap: spacing[2] },
    preview: { flex: 1, ...typography.subhead, color: colors.text.secondary },
    previewUnread: { color: colors.text.primary, fontWeight: '500' },
    badge: {
      minWidth: 20,
      height: 20,
      borderRadius: borderRadius.full,
      backgroundColor: colors.accent.primary,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: spacing[1],
    },
    badgeText: { ...typography.caption2, color: '#FFFFFF', fontWeight: '700' },
    separator: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: colors.separator.transparent,
      marginLeft: spacing[4] + 48 + spacing[3],
    },
  });
