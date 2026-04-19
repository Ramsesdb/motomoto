import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useColors } from '@/hooks/useColors';
import { spacing, typography, borderRadius } from '@/design';
import type { ThemeColors } from '@/design';
import type { Message, MessageStatus } from '@/types';

interface MessageBubbleProps {
  message: Message;
}

function formatTime(iso: string): string {
  const date = new Date(iso);
  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
}

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

function statusIcon(status: MessageStatus, colors: ThemeColors): { name: IconName; color: string } {
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

export function MessageBubble({ message }: MessageBubbleProps) {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const isOutbound = message.role === 'outbound';
  const icon = isOutbound ? statusIcon(message.status, colors) : null;

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

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    wrapper: { paddingHorizontal: spacing[4], paddingVertical: spacing[1] },
    wrapperIn: { alignItems: 'flex-start' },
    wrapperOut: { alignItems: 'flex-end' },
    bubble: {
      maxWidth: '80%',
      paddingHorizontal: spacing[4],
      paddingTop: spacing[3],
      paddingBottom: spacing[2],
      gap: spacing[1],
    },
    bubbleIn: {
      backgroundColor: colors.surfaceContainer,
      borderRadius: borderRadius.sm,
      borderTopLeftRadius: 2,
    },
    bubbleOut: {
      backgroundColor: 'rgba(75, 142, 255, 0.15)',
      borderRadius: borderRadius.sm,
      borderTopRightRadius: 2,
    },
    content: { ...typography.body, color: colors.onSurface, lineHeight: 22 },
    meta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: spacing[1] },
    time: { ...typography.caption2, color: colors.onSurfaceVariant },
  });
