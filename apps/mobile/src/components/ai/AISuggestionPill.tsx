import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useColors } from '@/hooks/useColors';
import { spacing, typography, borderRadius } from '@/design';
import type { ThemeColors } from '@/design';
import { Pressable } from '@/components/ui/Pressable';

interface AISuggestionPillProps {
  suggestion: string;
  onPress: (suggestion: string) => void;
  onDismiss?: () => void;
}

export function AISuggestionPill({ suggestion, onPress, onDismiss }: AISuggestionPillProps) {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <Pressable onPress={() => onPress(suggestion)} style={styles.outer}>
      <LinearGradient
        colors={[colors.secondary + '1A', colors.secondary + '0A']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.pill}
      >
        <View style={styles.iconCircle}>
          <MaterialCommunityIcons name="robot-outline" size={14} color={colors.accent.purple} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.label}>Sugerencia IA</Text>
          <Text style={styles.text} numberOfLines={2}>{suggestion}</Text>
        </View>
        {onDismiss !== undefined && (
          <Pressable onPress={onDismiss} style={styles.dismissButton}>
            <MaterialCommunityIcons name="close" size={14} color={colors.text.tertiary} />
          </Pressable>
        )}
      </LinearGradient>
    </Pressable>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    outer: { alignSelf: 'stretch' },
    pill: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: borderRadius.lg,
      paddingHorizontal: spacing[3],
      paddingVertical: spacing[3],
      gap: spacing[3],
    },
    iconCircle: {
      width: 28,
      height: 28,
      borderRadius: borderRadius.full,
      backgroundColor: colors.secondaryContainer + '33',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },
    textContainer: { flex: 1, gap: 2 },
    label: { ...typography.caption2, color: colors.accent.purple, fontWeight: '600' },
    text: { ...typography.subhead, color: colors.text.primary },
    dismissButton: {
      flexShrink: 0,
      width: 28,
      height: 28,
      borderRadius: borderRadius.full,
      backgroundColor: colors.background.tertiary,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
