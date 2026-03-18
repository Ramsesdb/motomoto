import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { colors, spacing, typography, borderRadius } from '@/design';
import type { Message, MessageStatus } from '@/types';

interface MessageBubbleProps {
  message: Message;
}

/** Format ISO timestamp to HH:MM. */
function formatTime(iso: string): string {
  const date = new Date(iso);
  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
}

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

/** Map MessageStatus → check-icon name and color for outbound messages. */
function statusIcon(status: MessageStatus): { name: IconName; color: string } {
  switch (status) {
    case 'sending':
      return { name: 'clock-outline', color: colors.text.tertiary };
    case 'sent':
      return { name: 'check', color: colors.text.tertiary };
    case 'delivered':
      return { name: 'check-all', color: colors.text.tertiary };
    case 'read':
      return { name: 'check-all', color: colors.accent.primary };
    case 'failed':
      return { name: 'alert-circle-outline', color: colors.accent.error };
  }
}

/**
 * Single chat message bubble.
 * - `outbound` (agent → contact): right-aligned, accent tint background, status icon.
 * - `inbound` (contact → agent): left-aligned, elevated surface background.
 */
export function MessageBubble({ message }: MessageBubbleProps) {
  const isOutbound = message.role === 'outbound';
  const icon = isOutbound ? statusIcon(message.status) : null;

  return (
    <View style={[styles.wrapper, isOutbound ? styles.wrapperOut : styles.wrapperIn]}>
      <View style={[styles.bubble, isOutbound ? styles.bubbleOut : styles.bubbleIn]}>
        <Text style={styles.content}>{message.content}</Text>

        <View style={styles.meta}>
          <Text style={styles.time}>{formatTime(message.sentAt)}</Text>
          {icon !== null && (
            <MaterialCommunityIcons name={icon.name} size={14} color={icon.color} />
          )}
        </View>
      </View>
    </View>
  );
}

const BUBBLE_MAX_WIDTH = '78%';

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[1],
  },
  wrapperIn: {
    alignItems: 'flex-start',
  },
  wrapperOut: {
    alignItems: 'flex-end',
  },
  bubble: {
    maxWidth: BUBBLE_MAX_WIDTH,
    paddingHorizontal: spacing[3],
    paddingTop: spacing[2],
    paddingBottom: spacing[1],
    gap: spacing[1],
  },
  bubbleIn: {
    backgroundColor: colors.background.elevated,
    borderRadius: borderRadius.lg,
    borderBottomLeftRadius: borderRadius.xs,
  },
  bubbleOut: {
    backgroundColor: colors.accent.primaryMuted,
    borderRadius: borderRadius.lg,
    borderBottomRightRadius: borderRadius.xs,
  },
  content: {
    ...typography.body,
    color: colors.text.primary,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: spacing[1],
  },
  time: {
    ...typography.caption2,
    color: colors.text.tertiary,
  },
});
