import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { colors, spacing, typography, borderRadius } from '@/design';
import { Pressable } from '@/components/ui/Pressable';

interface AISuggestionPillProps {
  /** The suggested reply text to display on the chip. */
  suggestion: string;
  /**
   * Called when the user taps the pill.
   * Typically used to pre-fill the ChatInput's `value`.
   */
  onPress: (suggestion: string) => void;
  /** Optional dismiss callback — renders an × icon on the right when provided. */
  onDismiss?: () => void;
}

/**
 * Tappable chip that shows an AI-generated suggested reply.
 * Tapping calls `onPress(suggestion)` so the parent can inject the text
 * into ChatInput (controlled mode).
 */
export function AISuggestionPill({ suggestion, onPress, onDismiss }: AISuggestionPillProps) {
  return (
    <Pressable onPress={() => onPress(suggestion)} style={styles.pill}>
      <MaterialCommunityIcons
        name="robot-outline"
        size={14}
        color={colors.accent.purple}
        style={styles.icon}
      />
      <Text style={styles.text} numberOfLines={2}>
        {suggestion}
      </Text>
      {onDismiss !== undefined && (
        <Pressable onPress={onDismiss} style={styles.dismissButton}>
          <MaterialCommunityIcons
            name="close"
            size={14}
            color={colors.text.tertiary}
          />
        </Pressable>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accent.purpleMuted,
    borderRadius: borderRadius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.accent.purple,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    gap: spacing[2],
    alignSelf: 'flex-start',
    maxWidth: '90%',
  },
  icon: {
    flexShrink: 0,
  },
  text: {
    flex: 1,
    ...typography.subhead,
    color: colors.text.primary,
  },
  dismissButton: {
    flexShrink: 0,
    padding: spacing[1],
  },
});
